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

class Map :
    def __init__(self) :
        self.total = 0
        self.num_skills  = num_skills
        self.skill_list = [i for i in range (num_skills)]
        self.list_day_ol = []
        self.list_day_off = []
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

        for i in range (num_doctors):
            day_off = random.randint(-1, schedule_day-1)
            while (self.list_day_off.count(day_off) >= 2):
                day_off = random.randint(0, schedule_day-1)
            
            # days.append(day_off)
            self.list_day_off.append(day_off)

            with open('instance-generator/Day-off.csv', 'a') as f:
                f.write("{}\n".format(day_off))

    def gen_day_work (self):
        for i in range (num_doctors):
            day_ol = random.randint(-1, schedule_day-1)
            while (self.list_day_ol.count(day_ol) >= 2 or day_ol == self.list_day_off[i]):
                day_ol = random.randint(0, schedule_day-1)

            room = random.randint(0, num_rooms - 1)
    
            with open('instance-generator/Day-ol.csv', 'a') as f:
                f.write("{},{}\n".format(day_ol, room))


        

                
if __name__ == '__main__':
    # m = Map(num_rooms, simulation_length, arrival_rate)
        
    m = Map()
    # m.write_file(i)
    # m.gen_doctor_list()
    # m.gen_room_list()
    m.gen_day_off()
    m.gen_day_work()











