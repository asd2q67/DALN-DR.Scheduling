import csv
from typing import List
import numpy as np
from numpy import random
import random
import string



'-- INSTANCE SETTING'
num_rooms = 10
num_doctors = 11
num_skills = 10
num_priority = 3
schedule_day = 14

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

        self.un_possible_room = [[]for i in range (num_doctors)]
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
        workLoad = []
        fields = ['doctorID', 'doctorName'] + room_list
        for i in range (num_doctors):
            feature = []
            #gen list of skill with room
            ability = [random.randint(0,2) for i in range (num_rooms)]
            
            work = [random.randint(0,10) for i in range (num_rooms)]
            for j in range (0, len(ability)) :
                if ability[j] == 0 :
                    work[j] = 0
                    self.un_possible_room[i].append(j)

            feature.append(i)
            feature.append(doctor_name[i])
            feature += ability
            
            skill_table.append(feature)
            workLoad.append(work)

        with open('instance-generator/Doctor.csv', 'w') as f:
     
            write = csv.writer(f)
            
            write.writerow(fields)
            write.writerows(skill_table)

            
        with open ('instance-generator/Workload.csv','w') as f1 :
            write = csv.writer(f1)

            write.writerow(room_list)
            write.writerows(workLoad)
        


    def gen_room_list (self):
        room_lists = []
        fields = ['roomID', 'priority', 'heavy' , 'demand1', 'demand2']

        for i in range (num_rooms):
            # demand0 = random.randint(0,5)
            demand1 = random.randint(0,5)
            demand2 = random.randint(0,5)
            if (random.uniform(1,100) <= 30):
                important = True
            else :
                important = False
            
            pri = random.randint(0, num_priority + 1)
            heavy = random.randint(0, 5)
            room = (i, pri, heavy, demand1, demand2)
            room_lists.append(room)

        with open('instance-generator/Room.csv', 'w') as f:
     
            write = csv.writer(f)
            
            write.writerow(fields)
            write.writerows(room_lists)

    def gen_day_off (self):
        field = ['']

        for i in range (num_doctors):
            day_off = random.randint(-1, schedule_day-1)
            while (self.list_day_off.count(day_off) >= 2):
                day_off = random.randint(0, schedule_day-1)
            
            # days.append(day_off)
            self.list_day_off.append(day_off)

            with open('instance-generator/Day-off.csv', 'a') as f:
                f.write("{}\n".format(day_off))

    def gen_day_work (self):
        field = ['doctorID','room', "day"]

        with open('instance-generator/Day-ol.csv', 'a') as f:
            write = csv.writer(f)
            
            write.writerow(field)

            for i in range (num_doctors):
                day_ol = random.randint(-1, schedule_day-1)
                while (self.list_day_ol.count(day_ol) >= 2 or day_ol == self.list_day_off[i]):
                    day_ol = random.randint(0, schedule_day-1)

                
                room = random.randint(0, num_rooms - 1)
                while (room in self.un_possible_room[i]):
                    room = random.randint(0, num_rooms - 1)
                    
                f.write("{},{},{}\n".format(i, room,day_ol))


        

                
if __name__ == '__main__':
    # m = Map(num_rooms, simulation_length, arrival_rate)
        
    m = Map()
    # m.write_file(i)
    # print (doctor_name)
    # m.gen_doctor_list()
    # m.gen_room_list()
    m.gen_day_off()
    m.gen_day_work()











