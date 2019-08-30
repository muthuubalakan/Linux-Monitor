from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .cpu_info import LinCPU
import asyncio


TIME_INTERVAL = 2


class MemoryinfoConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        data = LinCPU()
        self.meminfo = data.memoryinfo
        while True:
            try:
                await self.send_json(self.meminfo)
                await asyncio.sleep(TIME_INTERVAL)
            except Exception:
                await self.close()