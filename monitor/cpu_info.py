class LinCPU:
    """
    CPU 
    
    Method: call `LinCPU().memoryinfo`   
    """
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
        data = {}
        virtualmem = {}
        
        check_list = ["memtotal", "memfree", "memavailable"]
        virtual = ['vmalloctotal', 'vmallocused', 'vmallocchunk']
        
        for line in fd:
            memory, amount = line.split(':')
            try:
                memory = memory.strip()
                amount = amount.strip()
                if not self.mem_common(memory, check_list) and not self.mem_common(memory, virtual):
                    data[memory] = self.kb_to_gb(amount)
                elif self.mem_common(memory, virtual):
                    virtualmem[memory] = self.kb_to_gb(amount)
                else:
                    common[memory] = self.kb_to_gb(amount)
            except ZeroDivisionError and ValueError:
                pass
            
        assert data, (
            'Cannot get memory info.'   
        )
        return {'common': common, 'mem_info': data, 'virtual': virtualmem}
    
    def kb_to_gb(self, amount):
        space, unit = amount.split()
        return int(space) / 1000000      
            
    def mem_common(self, name, check_list):
        purified_string = ''.join(i for i in name if i.isalnum()).lower()
        if purified_string in check_list:
            return True
        else:
            return False