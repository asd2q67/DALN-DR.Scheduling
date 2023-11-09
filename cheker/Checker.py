import sys
sys.path.insert(0, 'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\cheker')
from Data_checker import Data
from Room_checker import Room
from Doctor_checker import Doctor
from solution import Solution
import csv


class Checker :
    def __init__(self, data : Data):

        self.data = data
        self.solution = Solution(self.data)

        self.sum_demand1 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]
        self.sum_demand2 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]

    def check (self):


        f = open ('noti.txt', 'w+', encoding="utf-8")
        for d in range (self.data.horizon):

            for r in range (self.data.get_num_rooms()):
                for doctorID in self.solution.solution[r][d]:

                    if (r not in self.solution.doctor_analysis[doctorID][d]) :
                        self.solution.doctor_analysis[doctorID][d].append(r)

        'Check is doctor is assigned 2 rooms or not'
        for doctor in range(self.data.get_num_doctors()):
            for d in range (self.data.horizon):
                if (len (self.solution.doctor_analysis[doctor][d]) > 1) :
                    f.write("Bác sĩ {} đang làm việc ở nhiều hơn hai phòng trong ca {}--> (Bác sĩ {} đang làm ở {} )\n".format(self.data.l_doctors[doctor].name,d,self.data.l_doctors[doctor].name,", ".join("phòng {}".format(room) for room in self.solution.doctor_analysis[doctor][d])))

        ' Check Skill is fit or not'
        for d in range (self.data.horizon):
            for r in range (self.data.get_num_rooms()):
                print (self.solution.solution[r][d])
                for doctorID in self.solution.solution[r][d]:
                    if (self.check_off(d,doctorID) == 1) :

                        f.write ("Bác sĩ {} đăng kí nghỉ ca {} nhưng vẫn được xếp lịch\n".format(self.data.l_doctors[doctorID].doctorId,d))

                    if (self.check_skill (self.data.l_doctors[doctorID],r) == 0) :
                        print ("Bác sĩ {} không có kinh nghiệm làm phòng {} ca {}\n".format(self.data.l_doctors[doctorID].name, r, d))
                        f.write ("Bác sĩ {} không có kinh nghiệm làm phòng {} ca {}\n".format(self.data.l_doctors[doctorID].name, r, d))


                num_doctor_in_room = len(self.solution.solution[r][d])
                demand = self.data.l_rooms[r].demand1 + self.data.l_rooms[r].demand2

                if (demand > num_doctor_in_room) :
                    f.write("phòng {} đang thiếu {} bác sĩ trong ca {}\n".format(r, demand -num_doctor_in_room, d))

                

    
    def check_skill(self,doctor,roomId):
        if roomId in doctor.level1:
            return 1
        elif roomId in doctor.level2:
            return 2
        else:
            return 0
        
    def is_assigned (self, shift, doctor):
        if (self.check_off (shift , doctor.doctorId) != 0 ):
            return 1 
        elif (self.check_ol (shift, doctor.doctorId) != 0):
            return 0
        else :
            return -1
        

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
    def print_demand(self):
        for r in range (self.data.get_num_rooms()):
            for d in range (self.data.horizon):
                print (self.solution.solution[r][d]," ",end="")
            print()