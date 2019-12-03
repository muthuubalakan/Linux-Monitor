from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .cpu_info import LinCPU
import asyncio
import pwd


TIME_INTERVAL = 1
cpu = LinCPU()

class MemoryinfoConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.accept()
            
    async def receive_json(self, data):
        command = data.get('command', None)
        if command == 'process':
            self.meminfo = False
            self.process_status = True
            await self.send_process_status()
        elif command == 'memory':
            self.meminfo = True
            self.process_status = False
            await self.send_meminfo()
        else:
            self.send(401)
    
    async def send_meminfo(self):
        while self.meminfo:
            await self.send_json(cpu.memoryinfo)
            await asyncio.sleep(TIME_INTERVAL)
    
    async def send_process_status(self):
        while self.process_status:
            status = await self.check_pids(cpu.get_process())
            await self.send_json({'process': status})
            await asyncio.sleep(TIME_INTERVAL)
        
    async def check_pids(self, data):
        return data
    
    def get_username(self, uid):
        uid = int(uid)
        try:
            return pwd.getpwuid(uid).pw_name
        except Exception:
            return 'Unknown'
    
                
    async def websocket_disconnect(self, *args):
        pass