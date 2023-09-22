from typing import List
import sys
sys.path.insert(0,'/home/toto/Code/Doctor_scheduling/schedule')
from Doctor import Doctor
from Room import Room


class Data:

    def __init__ (self, l_doctors : List['Doctor'], l_rooms : List['Room'] , day_off , day_ol ):
        self.l_doctors  = l_doctors
        self.l_rooms= l_rooms
        self.day_off = day_off
        self.day_ol = day_ol
        
    def get_num_rooms (self):
        return len(self.l_rooms)
    
    def get_num_doctors (self):
        return len(self.l_doctors)