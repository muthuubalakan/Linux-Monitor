import os
from datetime import timedelta, datetime
import time

TIMESTART = time.time()


class LinCPU:
    def __new__(cls, *args, **kwargs):
        import sys
        if not sys.platform == 'linux':
            raise SystemError('Call `LinCpu` from linux machine.')
        return super(LinCPU, cls).__new__(cls, *args, **kwargs)

    @property
    def memoryinfo(self):
        with open('/proc/meminfo') as mem:
            return self._mem(mem)

    def _mem(self, fd):
        common = {}
        virtualmem = {}
        swap = {}

        virtual = ['vmalloctotal', 'vmallocused', 'vmallocchunk']
        swapList = ['swaptotal', 'swapfree']

        for line in fd:
            memory, amount = line.split(':')
            try:
                memory = memory.strip()
                amount = amount.strip()
                if self.mem_common(memory, swapList):
                    swap[memory] = self.kb_to_gb(amount)
                elif self.mem_common(memory, virtual):
                    virtualmem[memory] = self.kb_to_gb(amount)
                else:
                    common[memory] = self.kb_to_gb(amount)

            except ZeroDivisionError and ValueError:
                pass
   
        return {'common': self.calculate_mem(common),
                'mem_info': common, 'swap': swap, 'virtual': virtualmem,
                'partitions': self.partitions(),
                'cpuload': self.get_cpu_load(),
                'uptime': self.get_uptime()}


    def calculate_mem(self, data):
        used = data['MemTotal'] - data['MemFree'] - data['Buffers'] - data['Cached'] - data["Slab"]

        return {'used': used, 'free': data['MemFree']}
        
    def kb_to_gb(self, amount):
        space, unit = amount.split()
        return int(space) / 1000000

    def mem_common(self, name, check_list):
        purified_string = ''.join(i for i in name if i.isalnum()).lower()
        if purified_string in check_list:
            return True
        else:
            return False

    def process_status(self, pid):
        with open(os.path.join('/proc', str(pid), 'status'), 'r') as f:
            return self.get_running_process(f)


    def get_running_process(self, f):
        import pwd
        wanted_list = ['name', 'state', 'pid']
        process = {}
        for line in f:
            field, content, *rest = line.replace('\t', '').strip().split(':')
            if line.startswith('Uid:'):
                uid = int(line.split()[1])
                process['username'] = pwd.getpwuid(uid).pw_name
            elif any(x in field.lower() for x in wanted_list):
                process[field] = content
        return process

    def get_process(self):
        data = []
        for pid in os.listdir('/proc'):
            if pid.isdigit():
                try:
                    data.append(self.process_status(pid))
                except Exception:
                    pass
        data = sorted(data, key=lambda i: i['Pid'], reverse=True)
        return data
    
    def get_uptime(self):
        with open('/proc/uptime') as uptime:
            return self._uptime(uptime)
    
    def _uptime(self, uptime):
        sys_time, idle, *rest = uptime.read().split()
        uptime_in_seconds = float(sys_time)
        a_day_in_seconds = 86400
        days = int(uptime_in_seconds / a_day_in_seconds)
        date = datetime.now() - timedelta(days=days)

        return str(date.date())
    
    def partitions(self):
        with open('/proc/partitions') as f:
            return self.get_partitions(f)
        
    def get_partitions(self, f):
        resp = []
        for line in f:
            if not 'block' in line:
                try:
                    major, minor, mem, name = line.split()
                    resp.append({'name':name, 'mem':mem})
                except Exception:
                    pass
        return resp
    

    def process_stat(self, pid):
        with open(os.path.join('/proc', str(pid), 'stat'), 'r') as f:
            return self.get_running_process(f)
        
    def calculate_cpu_load(self):
        with open(os.path.join('/proc/stat'), 'r') as f:
            return self.__cpu_load(f)
        
    def __cpu_load(self, f):
        return f.readline().split()
    
    def get_cpu_load(self):
        (cpu, user, nice, system, idle,
         iowait, irq, softirq,
         steal, guest,
        guest_nice, *r) = self.calculate_cpu_load()
        
        time.sleep(1)
        (newcpu, newuser, newnice, newsystem,
         newidle,
         newiowait, newirq, 
         newsoftirq,
         newsteal, newguest,
        newguest_nice, *newr) = self.calculate_cpu_load()
        
        old_idle = int(idle) + int(iowait)
        new_idle = int(newidle) + int(newiowait)
        
        old_non_idle = int(user) + int(nice) +  int(system) +  int(irq) + int(softirq) + int(steal)
        new_non_idle = int(newuser) + int(newnice) + int(newsystem) + int(newirq) + int(newsoftirq) + int(newsteal)
        old_total = int(old_idle) + int(old_non_idle)
        new_total = int(new_idle) + int(new_non_idle)
        total = new_total - old_total
        _idle = new_idle - old_idle
        
        return {'load': (total - _idle)/_idle,
                'time': int(time.time() - TIMESTART)}