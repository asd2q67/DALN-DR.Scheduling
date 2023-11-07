import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/schedule')
import copy
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room

from solution import Solution
from typing import List
import random 

class Solver:
    def __init__(self, data : Data):
        self.data: Data = data

        self.sum_demand1 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]
        self.sum_demand2 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]

        self.current_solution = Solution(data)
        self.temp_solution = Solution(data)
        self.best_solution = Solution(data)

        self.chosen_shifts = []

        self.max_iter = 100

    def schedule (self):

        self.build_initial_solution (self.best_solution)


        self.current_solution = copy.deepcopy(self.best_solution)

        for iter in range (self.max_iter):

            self.temp_solution = copy.deepcopy(self.current_solution)
            

            self.destroy(self.temp_solution)
            self.repair (self.temp_solution)

            'add threshold'
            if (self.temp_solution.get_obj() < self.current_solution.get_obj()) :
                self.current_solution = copy.deepcopy(self.temp_solution)

                if (self.current_solution.get_obj() < self.best_solution.get_obj()) :
                    self.best_solution = copy.deepcopy (self.current_solution)

                    # print ("\n Best solution obj : ")
                    # print (self.best_solution.get_obj())

        # print ("\n FINALL OBJ : ")
        # print (self.best_solution.get_obj())

    def destroy (self, s : Solution):
        # random choose a day 
        self.chosen_shifts = []
        num_chosen_shift = random.randint(4,9)
        count = 0
        while (count < num_chosen_shift):
            shift = random.randint(0, self.data.horizon-1)
            if (shift not in self.chosen_shifts):
                self.chosen_shifts.append(shift)
                count += 1
        
        for chosen_shift in self.chosen_shifts : 
            removed_doctor = []
            list_doctors_today = []

            #get list doctor work that day
            for r in range  (self.data.get_num_rooms()):
                # print ("{},{}".format(chosen_shift,r))
                list_doctors_today += (s.schedule_matrix[r][chosen_shift])
                # print (list_doctors_today)

            num_deleted_doctor = 3

            while (len (removed_doctor) < num_deleted_doctor):
                doctorId = random.choice(list_doctors_today)
                list_doctors_today.remove(doctorId)
                removed_doctor.append(doctorId)

                roomid = self.which_room_is_assigned(doctorId, chosen_shift,s)
                if (roomid == -1 ):
                    print ("")
                s.delete_doctor(doctorId,roomid,chosen_shift)


    def repair (self, s: Solution):

        for chosen_shift in self.chosen_shifts : 
            pool = copy.deepcopy(s.deleted_doctor[chosen_shift])

            random.shuffle(pool)

            for doctorID in pool:
                self.Greedy_insertion(s, doctorID,chosen_shift)
                # print (s.get_obj())


    def Greedy_insertion (self, s : Solution, doctorID, chosen_shift):
        best_room = -1
        bestGain = 9999

        position = copy.deepcopy(s.available_room[chosen_shift])

        random.shuffle(position)

        for pos in position :

            #check room is feasible or not
            if (self.check_room_is_feasible(self.data.l_doctors[doctorID], pos, chosen_shift) == -1 ):
                continue
            max_min_value = self.get_insertion_cost(s, doctorID, pos)

            if (max_min_value < bestGain) :
                best_room = pos
                bestGain = max_min_value
        
        'IF we can not find room for doctor ? '
        s.insert_doctor(doctorID, best_room,chosen_shift)

        
    def get_insertion_cost (self, s : Solution, doctorID, roomID):

        'add cost if room is not full'

        temp_max_min_matrix = copy.deepcopy(s.room_weights[doctorID])

        temp_max_min_matrix[roomID] += s.data.l_rooms[roomID].heavy

        max_min_value = max (temp_max_min_matrix) - min (temp_max_min_matrix)

        return max_min_value
        


    def build_initial_solution (self, s : Solution):
        self.init_matrix(s)
        # self.solution.export_solution()
        for shift in range (self.data.horizon):

            day = int(shift/2)
            
            list_doctor = self.get_available_doctor(shift,s)
            list_doctor_sorted = self.sort_by_workLoad(list_doctor)

            if (day != 0) :
                list_unscheduled_doctors = s.dump[day - 1]
                for doctorID in list_unscheduled_doctors:
                    if (self.data.l_doctors[doctorID] not in list_doctor_sorted):
                        list_doctor_sorted.insert(0,self.data.l_doctors[doctorID])
            
            # SANG
            if (shift % 2 == 0) :

                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    # if (doctor.doctorId == 9):
                    #     print ("Found!")
                    check = self.check_and_assign(doctor,shift, s)
                    if (check == -1):
                        continue

            else:
                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    chosen_room_morning = self.which_room_is_assigned(doctor.doctorId, shift-1, s)          

                    level = self.getLevelSupply(doctor,chosen_room_morning,shift)

                    # ? doctor is assigned in moring and room is not full
                    if (chosen_room_morning != -1 and level != -1):
                        self.update(doctor.doctorId,shift,chosen_room_morning, level, s)
                    
                    # ? If chosen room is full or morning, doctor can not be scheduled, choose room again
                    else :
                        check = self.check_and_assign(doctor,shift,s)
                        if (check == -1):
                            continue

    def check_room_is_feasible (self, doctor : Doctor, roomID, shift) :
    
        if self.getLevelSupply (doctor, roomID,shift) == -1 :
            return False
        else : 
            return True

    def check_and_assign (self, doctor, shift , s : Solution):
        day = int (shift/2)

        chosen_room = self.choose_room(doctor, shift, s )
        if (chosen_room == -1) :
            if (doctor.doctorId not in s.dump[day]):
                s.dump[day].append(doctor.doctorId)
            return -1                                                                                  
        level= self.getLevelSupply(doctor,chosen_room,shift)
        # update for moring and noon at the same time
        self.update(doctor.doctorId,shift,chosen_room,level, s)

        return 1
                   
            
    def which_room_is_assigned (self, doctorID, shift, s: Solution):
        for room in range (self.data.get_num_rooms()):
            if (doctorID in s.schedule_matrix[room][shift]):
                return room
        return -1 

    def is_assigned (self, shift, doctor, s : Solution):
        if (self.check_off (shift , doctor.doctorId) != 0 or self.check_ol (shift, doctor.doctorId, s) != 0):
            return True 
        else :
            return False

    def choose_room (self, doctor, shift, s : Solution):
        rooms = doctor.level1 + doctor.level2
        possible_rooms = []

        for r in rooms :
            if (self.getLevelSupply(doctor,r,shift) != -1):
                possible_rooms.append(r)
        
        if (len(possible_rooms) <= 0):
            return -1 
        cumulative_w = [doctor.work_load[i] for i in possible_rooms]
        sorted_room = self.sort (possible_rooms, cumulative_w)

        # for r in sorted_room:
        #     www = self.data.l_doctors[doctor.doctorId].work_load[r]
        #     heavy = self.data.l_rooms[r].heavy
        #     print(r, www, heavy)
        chosen_room = self.get_easiest_room(sorted_room)
        # w_before_test = copy.deepcopy(s.room_weights[doctor.doctorId])
        # possible_rooms.sort()
        
        # init_weight = self.data.workLoad[doctor.doctorId]
        # solution_weights = s.room_weights[doctor.doctorId]
        # print ("Doctor after :")

        # print ("{:7}{:>5}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(w_before_test), str(solution_weights)))
        
        # s.export_solution()
    
        return chosen_room
    


    def init_matrix (self, s : Solution):
        for i in range (self.data.get_num_doctors()):


            if (self.data.day_ol[i] != -1):
                date = self.data.day_ol[i]
                room = self.data.room_ol[i]

                skill = self.check_skill(self.data.l_doctors[i],room)

                demand1, demand2 = self.data.l_rooms[room].demand1, self.data.l_rooms[room].demand2

                if (skill == 0 or skill == 1):
                    if (demand1 != 0):
                        skill = 1
                    else :
                        skill = 2
                else:
                    if (demand2 == 0):
                        skill = 1
                    
                self.update(i,date,room, skill, s)

    
    def update (self, doctorID, date, roomID, level, s : Solution):

        # print ("\nAssign {} to {} in shift {} ".format(doctorID,roomID,date))
        s.update_matrix(doctorID,date,roomID)         
        # self.data.workLoad[doctorID][roomID] += self.data.l_rooms[roomID].heavy

        s.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        
        # update demand
        if (level == 1 ):
            self.sum_demand1[roomID][date] += 1
        elif (level == 2) : 
            self.sum_demand2[roomID][date] += 1
                
            
    def sort (self, list1, list2):

        a = list(set(list2))
        a.sort(reverse=False)
        res = []
        for i in a:
            for j in range(0, len(list2)):
                if(list2[j] == i):
                    res.append(list1[j])
        return (res)
    

    def check_skill(self,doctor,roomId):
        if roomId in doctor.level1:
            return 1
        elif roomId in doctor.level2:
            return 2
        else:
            return 0
    
    def sort_by_workLoad (self, l_doctor) -> List[Doctor]:
        temp = sorted(l_doctor, key = lambda x : x.workload_sum(), reverse=True)
        return temp
    
    
    def check_ol (self, shift, doctorID, s : Solution):
        check = 0
        for room in range (self.data.get_num_rooms()):
            if (doctorID in s.schedule_matrix[room][shift]):
                check = 1
                return check
        else :
            return check
    
    def check_off (self, shift, doctorID):
        if (doctorID in self.data.day_off[shift]):
            return 1
        return 0

    # check list doctor off each day 
    def get_available_doctor(self, shift, s : Solution):
        temp = self.data.l_doctors.copy()

        for doctor in temp :
            if (self.check_ol (shift, doctor.doctorId,s) == 1 or self.check_off (shift, doctor.doctorId) == 1) :
                temp.remove(doctor)
        return temp
    
    def getLevelSupply(self, doctor, roomID, shift):
        level = self.check_skill(doctor, roomID)
        supply1, supply2 = self.sum_demand1[roomID][shift], self.sum_demand2[roomID][shift]
        demand1, demand2 = self.data.l_rooms[roomID].demand1, self.data.l_rooms[roomID].demand2
        if (level == 2):
            if (supply2 < demand2):
                return level
            else:
                if (supply1 < demand1):
                    return 1
                else :
                    return -1
        else:
            if (supply1 < demand1):
                return level
            else:
                return -1
            
    def get_easiest_room (self, list_roomID):

        room_with_min_cum = list_roomID[0]
        min_heavy = self.data.l_rooms[room_with_min_cum].heavy
        for room in list_roomID :
            if (room != list_roomID[0]) :
                break
            if (self.data.l_rooms[room].heavy < min_heavy) :
                room_with_min_cum = room
                min_heavy = self.data.l_rooms[room].heavy
        
        return room_with_min_cum
        
        
                






    
    

        
        







    