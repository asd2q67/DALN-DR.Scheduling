import sys
sys.path.insert(0,'/home/toto/Code/Doctor_scheduling/schedule')

from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from solution import Solution
from typing import List

class Solver:
    def __init__(self, data : Data):
        self.data: Data = data
        self.solution = Solution(data)

    def init_matrix (self):
        for i in range (self.data.get_num_doctors()):
            if (self.data.day_ol[i] != -1):
                self.solution.update_matrix(i,self.data.day_ol[i],self.data.room_ol[i])             
    def run (self):

        for d in range (self.data.horizon):
            doctor_list = []

            for r in self.data.l_rooms:
                l_demand1 = []
                l_demand2 = []

                for i in self.data.l_doctors:
                    if (self.check(r.roomID, i.level1)):
                        l_demand1.append(i)
                    elif (self.check(r.roomID, i.level2)):
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
        a.sort(reverse=True)
        res = []
        for i in a:
            for j in range(0, len(list2)):
                if(list2[j] == i):
                    res.append(list1[j])
        return (res)
        
    
    def check (self, roomID, list_room):
        if (roomID in list_room):
            return 1
        else :
            return 0






    