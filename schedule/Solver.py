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
random.seed(0)
class Solver:
    def __init__(self, data : Data):
        self.data: Data = data

        self.current_solution = Solution(self.data)
        self.temp_solution = Solution(self.data)
        self.best_solution = Solution(self.data)

        self.chosen_shifts = []

        self.max_iter = 100

    def schedule (self):

        self.build_initial_solution (self.best_solution)
        print (self.best_solution.get_obj())


        self.current_solution = copy.deepcopy(self.best_solution)

        for iter in range (self.max_iter):

            self.temp_solution = copy.deepcopy(self.current_solution)
            self.temp_solution.cal_obj()

            # print (iter, self.temp_solution.get_obj())
            # print ("Before destroy : ")
            # for i in range(len(self.temp_solution.total_workLoad)):
                # print (i, self.temp_solution.total_workLoad[i])

            self.destroy(self.temp_solution)
            self.temp_solution.cal_obj()
            # self.temp_solution.export_solution()
            # print ("After destroy : ")
            # for i in range(len(self.temp_solution.total_workLoad)):
                # print (i, self.temp_solution.total_workLoad[i])


            
            # print (iter,self.temp_solution.get_obj())

            self.repair (self.temp_solution)
            self.temp_solution.cal_obj()
            # self.temp_solution.export_solution()
            # for i in range(len(self.temp_solution.total_workLoad)):
                # print (i, self.temp_solution.total_workLoad[i])

            
            # print ("after repair", iter, self.temp_solution.get_obj())


            # print (iter, self.temp_solution.get_obj())
            # self.temp_solution.export_solution()

            'add threshold'
            if (self.temp_solution.get_obj() < self.current_solution.get_obj()) :
                self.current_solution = copy.deepcopy(self.temp_solution)

                if (self.current_solution.get_obj() < self.best_solution.get_obj()) :
                    self.best_solution = copy.deepcopy (self.current_solution)

                    print ("\n Best solution obj found: ")
                    print (self.best_solution.get_obj())

        # print ("\n FINALL OBJ : ")
        # print (self.best_solution.get_obj())

    def destroy (self, s : Solution):
        # random choose a day 
        self.chosen_shifts = []
        num_chosen_shift = random.randint(1,4)
        # num_chosen_shift = 1
        count = 0
        while (count < num_chosen_shift ):
            shift = random.randint(0, self.data.horizon-1)
            # print ("CHOSEN shift : ", shift)

            if (shift not in self.chosen_shifts):
                
                if (shift % 2 == 0) :
                    self.chosen_shifts.append(shift)
                    self.chosen_shifts.append(shift + 1)
                else:
                    self.chosen_shifts.append(shift - 1)
                    self.chosen_shifts.append(shift)
                count += 1
        
        for shift in self.chosen_shifts : 
            removed_doctor = []
            list_doctors_today = []

            #get list doctor work that day
            for r in range  (self.data.get_num_rooms()):
                # print ("{},{}".format(chosen_shift,r))
                list_doctors_today += (s.schedule_matrix[r][shift])
                # print (list_doctors_today)

            for doctorId in list_doctors_today:
                roomid = self.which_room_is_assigned(doctorId, shift,s)
                s.delete_doctor(doctorId,roomid,shift)
            s.reset_shift(shift)
            s.update_supply(shift)
            

    def repair (self, s: Solution):

        for shift in self.chosen_shifts : 
            # pool = copy.deepcopy(s.deleted_doctor[chosen_shift])
            # pool = [i for i in range (s.data.get_num_doctors())]
            # pool = copy.deepcopy(s.deleted_doctor[chosen_shift])

            list_doctor_sorted = sorted(self.data.l_doctors, key = lambda x : x.workload_sum())


            if (shift % 2 == 0) :

                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    check = self.check_and_assign(doctor,shift, s)
                    if (check == -1):
                        continue

                    level = self.getLevelSupply(doctor,check,shift + 1,s) 
                    if (self.check_off(shift,doctor.doctorId) != 1 or self.check_ol (shift,doctor.doctorId,s) != 1 or level != -1) :
                        self.update(doctor.doctorId,shift + 1, check, level, s)

            else:
                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    chosen_room_morning = self.which_room_is_assigned(doctor.doctorId, shift-1, s)          

                    level = self.getLevelSupply(doctor,chosen_room_morning,shift,s)

                    # ? doctor is assigned in moring and room is not full
                    if (chosen_room_morning != -1 and level != -1):
                        self.update(doctor.doctorId,shift,chosen_room_morning, level, s)
                    
                    # ? If chosen room is full or morning, doctor can not be scheduled, choose room again
                    else :
                        check = self.check_and_assign(doctor,shift,s)
                        if (check == -1):
                            continue

        s.cal_obj()


    def Greedy_insertion (self, s : Solution, doctorID, chosen_shift):
        best_room = -1
        bestGain = 9999

        position = copy.deepcopy(s.available_room[chosen_shift])

        # random.shuffle(position)

        for pos in position :

            #check room is feasible or not
            if (self.check_room_is_feasible(s.data.l_doctors[doctorID], pos, chosen_shift,s) == False ):
                continue
            max_min_value = self.get_insertion_cost(s, doctorID, pos)

            if (max_min_value < bestGain) :
                best_room = pos
                bestGain = max_min_value
        
        'IF we can not find room for doctor ? '
        s.insert_doctor(doctorID, best_room,chosen_shift)
        level = self.getLevelSupply(s.data.l_doctors[doctorID],best_room,chosen_shift,s)
        self.update(doctorID,chosen_shift,best_room,level,s)

        
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

            if (shift == 3):
                print ("")


            day = int(shift/2)
            
            list_doctor = self.get_available_doctor(shift,s)
            # list_doctor_sorted = self.sort_by_workLoad(list_doctor)
            list_doctor_sorted = sorted(list_doctor, key = lambda x : x.workload_sum())

            # if (day != 0) :
            #     list_unscheduled_doctors = s.dump[day - 1]
            #     for doctorID in list_unscheduled_doctors:
            #         if (self.data.l_doctors[doctorID] not in list_doctor_sorted):
            #             list_doctor_sorted.insert(0,self.data.l_doctors[doctorID])
            
            # SANG
            if (shift % 2 == 0) :

                for doctor in list_doctor_sorted :
                    if (doctor.doctorId == 6) :
                        print(" ")
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    check = self.check_and_assign(doctor,shift, s)
                    if (check == -1):
                        continue
                    
                    # then assign same room in the afternoon

                    level = self.getLevelSupply(doctor,check,shift + 1,s) 
                    a = self.check_off(shift + 1,doctor.doctorId)
                    if (self.check_off(shift + 1,doctor.doctorId) != 1 and self.check_ol (shift + 1,doctor.doctorId,s) != 1 and level != -1) :
                        self.update(doctor.doctorId,shift + 1, check, level, s)


            else:
                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor, s) == True) :
                        continue

                    chosen_room_morning = self.which_room_is_assigned(doctor.doctorId, shift-1, s)          

                    level = self.getLevelSupply(doctor,chosen_room_morning,shift,s)

                    # ? doctor is assigned in moring and room is not full
                    if (chosen_room_morning != -1 and level != -1):
                        self.update(doctor.doctorId,shift,chosen_room_morning, level, s)
                    
                    # ? If chosen room is full or morning, doctor can not be scheduled, choose room again
                    else :
                        check = self.check_and_assign(doctor,shift,s)
                        if (check == -1):
                            continue
            
            s.export_solution()
        s.cal_obj()

    def check_room_is_feasible (self, doctor : Doctor, roomID, shift, s : Solution) :
    
        if self.getLevelSupply (doctor, roomID,shift,s) == -1 :
            return False
        else : 
            return True

    def check_and_assign (self, doctor, shift , s : Solution):
        day = int (shift/2)

        chosen_room = self.choose_room(doctor, shift, s )
        if (doctor.doctorId == 0):
            xxx = 0
        if (chosen_room == -1) :
            if (doctor.doctorId not in s.dump[day]):
                s.dump[day].append(doctor.doctorId)
            return -1                                                                                  
        level= self.getLevelSupply(doctor,chosen_room,shift,s)
        # update for moring and noon at the same time
        self.update(doctor.doctorId,shift,chosen_room,level, s)

        return chosen_room
                   
            
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

    def choose_room (self, doctor :Doctor, shift, s : Solution):
        rooms = doctor.level1 + doctor.level2
        possible_rooms = []

        for r in rooms :
            if (self.getLevelSupply(doctor,r,shift,s) != -1):
                possible_rooms.append(r)
        
        if (len(possible_rooms) <= 0):
            return -1 
        cum_dict = {}
        for i in possible_rooms:

            cum_dict[i] = s.room_weights[doctor.doctorId][i]
        # cumulative_w = [doctor.work_load[i] for i in possible_rooms]
        for i in range(len(possible_rooms)):
            for j in range(i+1, len(possible_rooms)):
                roomi = possible_rooms[i]
                roomj = possible_rooms[j]
                if (cum_dict[ roomi ] > cum_dict[roomj]):
                    temp = possible_rooms[i]
                    possible_rooms[i] = possible_rooms[j]
                    possible_rooms[j] = temp
        
        # for room in possible_rooms:
        #     print(room, cum_dict[room])
        # sorted_room = self.sort (possible_rooms, cumulative_w)

        # print (sorted_room)

        # for r in sorted_room:
        #     www = self.data.l_doctors[doctor.doctorId].work_load[r]
        #     heavy = self.data.l_rooms[r].heavy
        #     print(r, www, heavy)
        # chosen_room = self.get_easiest_room(sorted_room)
        # w_before_test = copy.deepcopy(s.room_weights[doctor.doctorId])
        # possible_rooms.sort()
        
        # init_weight = self.data.workLoad[doctor.doctorId]
        # solution_weights = s.room_weights[doctor.doctorId]
        # print ("Doctor after :")

        # print ("{:7}{:>5}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(w_before_test), str(solution_weights)))
        
        # s.export_solution()
    
        return possible_rooms[0]
    


    def init_matrix (self, s : Solution):
        for j in range (self.data.get_num_doctors()):


            if (len(self.data.day_ol[j]) != 0):
                date = self.data.day_ol[j]
                room = self.data.room_ol[j]

                for i in range (len(date)):
                    skill = self.check_skill(s.data.l_doctors[j],room[i])

                    demand1, demand2 = self.data.l_rooms[room[i]].demand1, self.data.l_rooms[room[i]].demand2

                    if (skill == 0 or skill == 1):
                        if (demand1 != 0):
                            skill = 1
                        else :
                            skill = 2
                    else:
                        if (demand2 == 0):
                            skill = 1
                        
                    self.update(j,date[i],room[i], skill, s)

    
    def update (self, doctorID, date, roomID, level, s : Solution):

        # print ("\nAssign {} to {} in shift {} ".format(doctorID,roomID,date))
        s.update_matrix(doctorID,date,roomID)         
        # self.data.workLoad[doctorID][roomID] += self.data.l_rooms[roomID].heavy

        s.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        s.data.l_doctors[doctorID].work_load[roomID] += self.data.l_rooms[roomID].heavy

        # s.a[1] = -1
        
        # update demand
        if (level == 1 ):
            s.sum_supply1[roomID][date] += 1
        elif (level == 2) : 
            s.sum_supply2[roomID][date] += 1
        
        # s.export_solution()
                
            
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
        temp = sorted(l_doctor, key = lambda x : x.workload_sum())

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
        temp = s.data.l_doctors.copy()

        for doctor in temp :
            if (self.check_ol (shift, doctor.doctorId,s) == 1 or self.check_off (shift, doctor.doctorId) == 1) :
                temp.remove(doctor)
        return temp
    
    def getLevelSupply(self, doctor, roomID, shift, s : Solution ):
        level = self.check_skill(doctor, roomID)
        supply1, supply2 = s.sum_supply1[roomID][shift], s.sum_supply2[roomID][shift]
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
        
        
                






    
    

        
        







    