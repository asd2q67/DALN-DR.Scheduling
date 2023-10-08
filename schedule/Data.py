from typing import List
import sys
sys.path.insert(0,'F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\schedule')
from Doctor import Doctor
from Room import Room
from Demand import Demand


class Data:

    def __init__ (self, l_doctors : List['Doctor'], l_rooms : List['Room'] , day_off , day_ol , room_ol, l_demands : List['Demand']):
        self.l_doctors  = l_doctors
        self.l_rooms= l_rooms
        self.day_off = day_off
        self.day_ol = day_ol
        self.room_ol = room_ol
        self.horizon = 7
        self.l_demands= l_demands
        
    def get_num_rooms (self):
        return len(self.l_rooms)
    
    def get_num_doctors (self):
        return len(self.l_doctors)

    def get_num_demands (self):
        return len(self.l_demands)