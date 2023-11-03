import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/schedule')
import copy
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from Demand import Demand
from solution import Solution
from typing import List

class Solver:
    def __init__(self, data : Data):
        self.data: Data = data

        self.sum_demand1 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]
        self.sum_demand2 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]

        self.current_solution = Solution(data)
        self.temp_solution = Solution(data)
        self.best_solution = Solution(data)

    def destroy (self):
        pass

    def repair (self):
        pass

        
    def build_initial_solution (self):
        self.init_matrix()
        # self.solution.export_solution()
        for shift in range (self.data.horizon):
            if (shift == 10):
                print ("")

            day = int(shift/2)
            
            list_doctor = self.get_available_doctor(shift)
            list_doctor_sorted = self.sort_by_workLoad(list_doctor)

            if (day != 0) :
                list_unscheduled_doctors = self.current_solution.dump[day - 1]
                for doctorID in list_unscheduled_doctors:
                    if (self.data.l_doctors[doctorID] not in list_doctor_sorted):
                        list_doctor_sorted.insert(0,self.data.l_doctors[doctorID])
            
            # SANG
            if (shift % 2 == 0) :

                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor) == True) :
                        continue

                    if (doctor.doctorId == 9):
                        print ("Found!")
                    check = self.check_and_assign(doctor,shift)
                    if (check == -1):
                        continue

            else:
                for doctor in list_doctor_sorted :
                    if (self.is_assigned(shift,doctor) == True) :
                        continue

                    chosen_room_morning = self.which_room_is_assigned(doctor.doctorId, shift-1)          

                    level = self.getLevelSupply(doctor,chosen_room_morning,shift)

                    # ? doctor is assigned in moring and room is not full
                    if (chosen_room_morning != -1 and level != -1):
                        self.update(doctor.doctorId,shift,chosen_room_morning, level)
                    
                    # ? If chosen room is full or morning, doctor can not be scheduled, choose room again
                    else :
                        check = self.check_and_assign(doctor,shift)
                        if (check == -1):
                            continue

    def check_and_assign (self, doctor, shift):
        day = int (shift/2)

        chosen_room = self.choose_room(doctor, shift)
        if (chosen_room == -1) :
            if (doctor.doctorId not in self.current_solution.dump[day]):
                self.current_solution.dump[day].append(doctor.doctorId)
            return -1                                                                                  
        level= self.getLevelSupply(doctor,chosen_room,shift)
        # update for moring and noon at the same time
        self.update(doctor.doctorId,shift,chosen_room,level)

        return 1
                   
            
    def which_room_is_assigned (self, doctorID, shift):
        for room in range (self.data.get_num_rooms()):
            if (doctorID in self.current_solution.schedule_matrix[room][shift]):
                return room
        return -1 

    def is_assigned (self, shift, doctor):
        if (self.check_off (shift , doctor.doctorId) != 0 or self.check_ol (shift, doctor.doctorId) != 0):
            return True 
        else :
            return False

    def choose_room (self, doctor, shift):
        rooms = doctor.level1 + doctor.level2
        possible_rooms = []

        for r in rooms :
            if (self.getLevelSupply(doctor,r,shift) != -1):
                possible_rooms.append(r)
        
        if (len(possible_rooms) <= 0):
            return -1 
        cumulative_w = [doctor.work_load[i] for i in possible_rooms]
        sorted_room = self.sort (possible_rooms, cumulative_w)

        for r in sorted_room:
            www = self.data.l_doctors[doctor.doctorId].work_load[r]
            heavy = self.data.l_rooms[r].heavy
            print(r, www, heavy)

        chosen_room = self.get_easiest_room(sorted_room)

        self.print_to_check(doctor,possible_rooms)
    
        return chosen_room
    


    def init_matrix (self):
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
                    
                self.update(i,date,room, skill)

    
    def update (self, doctorID, date, roomID, level):

        print ("\nAssign {} to {} in shift {} ".format(doctorID,roomID,date))
        self.current_solution.update_matrix(doctorID,date,roomID)         
        # self.data.workLoad[doctorID][roomID] += self.data.l_rooms[roomID].heavy

        self.current_solution.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        
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
    
    
    def check_ol (self, shift, doctorID):
        check = 0
        for room in range (self.data.get_num_rooms()):
            if (doctorID in self.current_solution.schedule_matrix[room][shift]):
                check = 1
                return check
        else :
            return check
    
    def check_off (self, shift, doctorID):
        if (doctorID in self.data.day_off[shift]):
            return 1
        return 0

    # check list doctor off each day 
    def get_available_doctor(self, shift):
        temp = self.data.l_doctors.copy()

        for doctor in temp :
            if (self.check_ol (shift, doctor.doctorId) == 1 or self.check_off (shift, doctor.doctorId) == 1) :
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
        

    def print_to_check (self, doctor, possible_rooms):
        w_before_test = copy.deepcopy(self.current_solution.room_weights[doctor.doctorId])
        possible_rooms.sort()
        init_weight = self.data.workLoad[doctor.doctorId]
        solution_weights = self.current_solution.room_weights[doctor.doctorId]
        print ("Doctor after :")

        print ("{:7}{:>5}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(w_before_test), str(solution_weights)))
        
        self.current_solution.export_solution()
                






    
    

        
        







    