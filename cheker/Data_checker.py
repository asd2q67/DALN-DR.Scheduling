from typing import List
import sys
sys.path.insert(0,'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\schedule')
from Doctor_checker import Doctor
from Room_checker import Room



class Data:

    def __init__ (self, l_doctors : List['Doctor'], l_rooms : List['Room'] , day_off , day_ol , room_ol, workLoad :list):
        self.l_doctors  = l_doctors
        self.l_rooms= l_rooms
        self.day_off = day_off
        self.day_ol = day_ol
        self.room_ol = room_ol
        self.horizon = 14
        self.workLoad= workLoad
        
    def get_num_rooms (self):
        return len(self.l_rooms)

    def get_num_doctors (self):
        return len(self.l_doctors)
    
    def display_stats (self):
        # chieu tung bac si
        possible_doctor = [[] for i in range(self.get_num_rooms())]

        for doctor in self.l_doctors:
            possible_rooms = doctor.level1 + doctor.level2

            print("{:9}".format(doctor.name), end='')
            print(possible_rooms)

        # chieu tung phong
            for room in possible_rooms :
                possible_doctor[room].append(doctor.doctorId)
        print ('-------------- Possible doctors : ')
        for i in range (len(possible_doctor)):
            print("{:<9}".format(i), end='')
            print (possible_doctor[i])
                