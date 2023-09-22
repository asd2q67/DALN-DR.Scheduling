import csv
from typing import List
import numpy as np
from numpy import random
import random
import string



'-- INSTANCE SETTING'
num_rooms = 5
num_doctors = 10
num_skills = 4
num_priority = 3
schedule_day = 7

doctor_name = list(string.ascii_uppercase)
room_list = ['r{}'.format(i) for i in range (num_rooms)]



'-- DATA'

# class Room :
#     def __init__(self, id : int, important : bool, priority : int, demand_type0 : int, demand_type1 : int, demand_type2 : int  ) :
#         self.room_id = id
#         self.demand_type0 = demand_type0
#         self.demand_type1 = demand_type1
#         self.demand_type2 = demand_type2
#         #Heavy work-load or not
#         self.important = important
#         self.priority = priority

# class Doctor :
#     def __init__(self, id : int, skill_type1 : List[int], skill_type2 : List[int]) :
#         self.doctor_id = id
#         self.skill_type1 = skill_type1
#         self.skill_type2 = skill_type2

class Map :
    def __init__(self) :
        self.total = 0
        self.num_skills  = num_skills
        self.skill_list = [i for i in range (num_skills)]
        # self.doctor_list = self.gen_doctor_list()
        # self.room_list = self.gen_room_list()

    '''
        Tao ra bang kha nang lam viec
        0 : ko co kinh nghiem
        1 : lam duoc
        2 : lam tot
    '''
    def gen_doctor_list (self):

        skill_table = []
        fields = ['doctorID', 'doctorName', 'workLoad'] + room_list
        for i in range (num_doctors):
            feature = []
            #gen list of skill with room
            ability = [random.randint(0,2) for i in range (num_rooms)]
            feature.append(i)
            feature.append(doctor_name[i])
            feature.append(random.randint(0,5))
            feature += ability
            
            skill_table.append(feature)

        with open('instance-generator/Doctor.csv', 'w') as f:
     
            write = csv.writer(f)
            
            write.writerow(fields)
            write.writerows(skill_table)
        


    def gen_room_list (self):
        room_lists = []
        fields = ['roomID', 'heavy', 'priority', 'demand0', 'demand1', 'demand2']

        for i in range (num_rooms):
            demand0 = random.randint(0,3)
            demand1 = random.randint(0,3)
            demand2 = random.randint(0,3)
            if (random.uniform(1,100) <= 30):
                important = True
            else :
                important = False
            
            pri = random.randint(0, num_priority + 1)

            room = (i, important, pri, demand0, demand1, demand2)
            room_lists.append(room)

        with open('instance-generator/Room.csv', 'w') as f:
     
            write = csv.writer(f)
            
            write.writerow(fields)
            write.writerows(room_lists)

    def gen_day_off (self):

        list_day_off = []
        list_day_ol = []
        A = []
        for i in range (num_doctors):
            days = []
            day_off = random.randint(-1, schedule_day)
            while (list_day_off.count(day_off) >= 2):
                day_off = random.randint(0, schedule_day)
            
            days.append(day_off)
            list_day_off.append(day_off)

            day_ol = random.randint(-1, schedule_day)
            while (list_day_ol.count(day_ol) >= 2 or day_ol == day_off):
                day_ol = random.randint(0, schedule_day)

            days.append(day_ol)
            list_day_ol.append(day_ol)
            A.append(days)

        with open('instance-generator/Day-off.csv', 'w') as f:
            write = csv.writer(f)
            write.writerows(A)
                
if __name__ == '__main__':
    # m = Map(num_rooms, simulation_length, arrival_rate)
        
    m = Map()
    # m.write_file(i)
    # m.gen_doctor_list()
    # m.gen_room_list()
    m.gen_day_off()











