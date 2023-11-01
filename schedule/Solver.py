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
        self.solution = Solution(data)
        self.sum_demand1 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]
        self.sum_demand2 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]

        # self.room_weights = [[0 for i in range (self.data.get_num_rooms())] for i in range (self.data.get_num_doctors())]
        


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
        self.solution.update_matrix(doctorID,date,roomID)         
        # self.data.workLoad[doctorID][roomID] += self.data.l_rooms[roomID].heavy

        self.solution.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        
        # update demand
        if (level == 1 ):
            self.sum_demand1[roomID][date] += 1
        elif (level == 2) : 
            self.sum_demand2[roomID][date] += 1

    def run (self):

        for d in range (self.data.horizon):
            doctor_list = []

            for r in self.data.l_rooms:
                l_demand1 = []
                l_demand2 = []

                for i in self.data.l_doctors:
                    if (self.check_ol(r.roomID, i.level1)):
                        l_demand1.append(i)
                    elif (self.check_ol(r.roomID, i.level2)):
                        l_demand2.append(i)

                'choose demand1'
                doc1 = self.choose_doctor(l_demand1, r.demand1)
                for j in doc1 :
                    self.solution.update_matrix(j.doctorId, d, r.roomID)
                    j.work_load += 1

                'choose demand2'
                doc2 = self.choose_doctor(l_demand2, r.demand2)
                for j in doc2 :
                    self.solution.update_matrix(j.doctorId, d, r.roomID)
                    j.work_load += 1
                


    def choose_doctor (self, l_demand : List[Doctor], n_demand : int) -> List[Doctor]:
        work_load = []
        temp = []

        chosen = []
        for doctor in l_demand:
            work_load.append(doctor.work_load)
            temp = self.sort(l_demand, work_load)

        for i in range (n_demand):
            chosen.append(temp[i])
        
        return chosen
                
            
    def sort (self, list1, list2):

        a = list(set(list2))
        a.sort(reverse=False)
        res = []
        for i in a:
            for j in range(0, len(list2)):
                if(list2[j] == i):
                    res.append(list1[j])
        return (res)
        
    
    def check_ol (self, roomID, list_room):
        if (roomID in list_room):
            return 1
        else :
            return 0
        
    def sort_doc(self,doc_list):
        a = doc_list
        a = sorted(a,key = lambda x : x.workload_sum())
        return a

    def sort_dict(self,my_dict):
       sorted_dict = dict(sorted(my_dict.items(), key=lambda item: item[1]))

       return sorted_dict

    def check_skill(self,doctor,roomId):
        if roomId in doctor.level1:
            return 1
        elif roomId in doctor.level2:
            return 2
        else:
            return 0
        
    def check_demand1(self,roomID):
        d = self.data.l_demands[roomID].demand1
        if d>0:
            return True
        elif d == 0:
            return False
    
    def check_demand2(self,roomID,demand):
        d = self.data.l_demands[roomID].demand2
        if d>0:
            return True
        elif d == 0:
            return False
        
    def search_index(self,lst,value):
            for j in range (len(lst)):
                if lst[j].doctorId == value:
                    return j
            return -1
        
    def choose_bs(self,doc,roomID,d):
        self.solution.update_matrix(doc.doctorId,d,roomID)
        doc.work_load[roomID] += self.data.l_rooms[roomID].heavy

    def run1(self):
        for d in range (self.data.horizon):

            a= []
            for dr in self.data.l_doctors:
                a.append(dr)
            r_demand1 = []
            r_demand2 = []
            demand1 = []
            for dm in self.data.l_demands:
                demand1.append(0)
                r_demand1.append(0)

            demand2 = []
            for dm in self.data.l_demands:
                demand2.append(0)
                r_demand2.append(0)

            
            for i in range(len(self.data.l_rooms)):
                for j in range(len(self.solution.schedule_matrix[i][d])):
                    if self.check_skill(self.data.l_doctors[j],i) == 1:
                        r_demand1[i] +=1
                        a.pop(self.search_index(a,self.solution.schedule_matrix[i][d][j]))
                    if self.check_skill(self.data.l_doctors[j],i) == 2:
                        r_demand2[i] +=1
                        a.pop(self.search_index(a,self.solution.schedule_matrix[i][d][j]))
            
            sorted_doc_list = self.sort_doc(a)
            for i in a:
                print(i.doctorId)
            print('---------------------')

            
            

            
            for doc in sorted_doc_list:
                

                sorted_workload = dict(sorted(doc.work_load.items(), key=lambda item: item[1]))
                i = 0
                list_keys = list(sorted_workload.keys())
                for i in list_keys:


                    if self.check_skill(doc,i) == 1:
                        if demand1[i] + r_demand1[i] < self.data.l_demands[i].demand1 :
                            # print("Phong" , i ,  "nay con cho vi bac lam viec cung duoc")
                            self.choose_bs(doc,i,d)
                            demand1[i] +=1
                            r_demand1[i] +=1
                            break
                        else:
                            # print('Qua phong khac di bac co nguoi roi')
                            continue
                    if self.check_skill(doc,i) == 2:
                        if demand2[i] + r_demand2[i] < self.data.l_demands[i].demand2 :
                            # print("Phong" , i ,  "nay con cho vi bac dinh vl")
                            self.choose_bs(doc,i,d)
                            demand2[i] +=1
                            r_demand2[i] +=1
                            break
                        else:
                            #  print('Qua phong khac di bac co nguoi roi')
                             continue
            
            # print("ngay thu " , d , " cac phong co ngan nay nguoi" )
            # print("lam bth" , r_demand1)
            # print("dinh vl" , r_demand2)
                # if i == len(list_keys):
                #     print("BS nay het cuu")
                # print(first_key , ' - ' , self.check_skill(doc,first_key))
                # self.solution.update_matrix(doc.doctorId,d,first_key)
                # doc.work_load[first_key] += self.data.l_rooms[first_key].heavy
    def sort_by_workLoad (self, l_doctor) -> List[Doctor]:
        temp = sorted(l_doctor, key = lambda x : x.workload_sum(), reverse=True)
        return temp
    
    
    def check_ol (self, shift, doctorID):
        check = 0
        for room in range (self.data.get_num_rooms()):
            if (doctorID in self.solution.schedule_matrix[room][shift]):
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
                return 1
        else:
            if (supply1 < demand1):
                return level
            else:
                return -1

    def schedule (self):
        self.init_matrix()
        # self.solution.export_solution()
        for shift in range (0,self.data.horizon,2):
            dump = []

            list_doctor = self.get_available_doctor(shift)
            list_doctor_sorted = self.sort_by_workLoad(list_doctor)
            # for doc in list_doctor_sorted:
            #     print(doc.workload_sum())
            # SANG
            if (shift % 2 == 0) :
                for doctor in list_doctor_sorted :

                    if (doctor.doctorId == 0) :
                        print("Found!")

                    possible_rooms = doctor.level1 + doctor.level2
                    weight = [doctor.work_load[i] for i in possible_rooms]

                    # w = dict ()

                    # for i in range (len(possible_rooms)) :
                    #     w[possible_rooms[i]] = weight[i]

                    sorted_room = self.sort (possible_rooms, weight)


                    # for room in sorted_room:
                    #     print(w[room],end=' ')
                    # print("")

                    for room in sorted_room :
                        level= self.getLevelSupply(doctor,room,shift)

                        if (level == -1) : continue
                        # update for moring and noon at the same time
                        self.update(doctor.doctorId,shift,room,level)

                        #check if they off in noon
                        if (self.check_off (shift + 1, doctor.doctorId) == 0 and self.check_ol (shift + 1, doctor.doctorId) == 0):
                            # check da co nguoi lam hay chua
                            self.update(doctor.doctorId, shift + 1, room, level)
                        break


                    possible_rooms = doctor.level1 + doctor.level2
                    possible_rooms.sort()
                    init_weight = self.data.workLoad[doctor.doctorId]
                    solution_weights = self.solution.room_weights[doctor.doctorId]
                    print ("Doctor after :")

                    print ("{:7}{:>5}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(init_weight), str(solution_weights)))
                    
                    self.solution.export_solution()
                            

                        # if doctor has ability = 2, he/she can work in room = 1

                






    
    

        
        







    