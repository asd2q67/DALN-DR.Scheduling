from Data import Data
import copy
from Doctor import Doctor
from Room import Room
import pandas as pd

class Solution :
    def __init__(self, data : Data):
        self.data = copy.deepcopy(data)
        self.schedule_matrix = [[[] for i in range (data.horizon)] for i in range (data.get_num_rooms())]

        self.sum_supply1 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]
        self.sum_supply2 = [[0 for i in range (self.data.horizon)] for j in range (self.data.get_num_rooms())]

        self.room_weights = [row[:] for row in self.data.workLoad]
        # save list patient can not be assigned for each day
        self.dump = [[] for i in range (int(data.horizon/2))] 

        # max-min (OBJ)
        self.max_min = [0 for i in range (self.data.get_num_doctors())]

        self.deleted_doctor = [[] for d in range (self.data.horizon)]

        self.available_room = [[] for d in range (self.data.horizon)]

        self.demand_cost = -1

        self.total_workLoad = [0 for i in range (self.data.get_num_doctors())]

        # self.obj = -1


    def update_matrix (self, doctor_id , dateID, roomID):
        self.schedule_matrix[roomID][dateID].append(doctor_id)

    
    def statis (self):
        '''
        Export info related to doctors 
        '''

        f = open ('solution.txt', 'w')
        f.write( "{:<7}{:>25}{:>35}{:>35}{:>35}\n".format('DoctorID', "Name", "Possible room","Initial_weights", "Solution_Weights"))

        for doctor in self.data.l_doctors :
            possible_rooms = doctor.level1 + doctor.level2
            possible_rooms.sort()
            
            init_weight = self.data.workLoad[doctor.doctorId]
            # solution_weights = self.room_weights[doctor.doctorId]
            solution_weights = doctor.work_load

            f.write ("{:<7}{:>25}{:>35}{:>35}{:>35}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(init_weight), str(solution_weights)))

    def export_solution (self):
        day_list = ['{}'.format(i) for i in range(self.data.horizon)]

        df = pd.DataFrame(self.schedule_matrix, columns=day_list)
        df.to_csv('solution.csv', index=False)
        df.to_csv('solution_backup.csv', index=False)
        print (df)

    def export_by_doctor (self):

        doctor_analysis = [[[] for j in range (self.data.horizon)] for i in range (self.data.get_num_doctors()) ]

        for d in range (self.data.horizon):

            for r in range (self.data.get_num_rooms()):
                for doctorID in self.schedule_matrix[r][d]:

                    if (r not in doctor_analysis[doctorID][d]) :
                        doctor_analysis[doctorID][d].append(r)
    
        day_list = ['{}'.format(i) for i in range(self.data.horizon)]

        df = pd.DataFrame(doctor_analysis, columns=day_list)
        df.to_csv('doctor_calendar.csv', index=False)
        df.to_csv('doctor_calendar_backup.csv', index=False)
        print (df)
                

    def cal_obj (self):
        for doctor in self.data.l_doctors:

            # room_can_work = 

            # self.max_min[doctor.doctorId] = max (self.room_weights[doctor.doctorId]) - 
            self.total_workLoad[doctor.doctorId] = sum (self.room_weights[doctor.doctorId])

        'calculate room_not_full cost'

        total_supply = self.cal_sum(self.sum_supply1) + self.cal_sum(self.sum_supply2)
        total_demand = self.cal_total_demand() * self.data.horizon

        self.demand_cost = (total_demand - total_supply) * 1000

        # print (self.demand_cost, total_supply - total_demand)
    
    # def filter_room_can_work (self, doctor, room):
    #     demand1 = room
    
    def reset_shift (self, shift):
        for room in range (self.data.get_num_rooms()):
            self.schedule_matrix[room][shift] = []
        

    def delete_doctor (self, doctorID, roomID, shift):
        # self.deleted_doctor[day].append(doctorID)

        self.schedule_matrix[roomID][shift].remove(doctorID)
        self.room_weights[doctorID][roomID] -= self.data.l_rooms[roomID].heavy

        self.max_min[doctorID] = max (self.room_weights[doctorID]) - min(self.room_weights[doctorID])

        # if (roomID not in self.available_room[day]):
        #     self.available_room[day].append(roomID)

        # self.cal_obj()
        

    def update_supply (self, shift):
        for r in range (self.data.get_num_rooms()):
            self.sum_supply1[r][shift] = 0
            self.sum_supply2[r][shift] = 0
        self.cal_obj()
        

    def insert_doctor (self, doctorID, roomID, shift):
        self.deleted_doctor[shift].remove(doctorID)

        # self.update_matrix(doctorID,day,roomID)
        # self.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        self.max_min[doctorID] = max (self.room_weights[doctorID]) - min(self.room_weights[doctorID])

        # self.cal_obj()


    def get_obj (self):
        # obj = sum(self.max_min)
        obj = max (self.total_workLoad) - min (self.total_workLoad)

        obj += self.demand_cost

        return obj

    def cal_sum (self, A):

        sum = 0
        for i in range (len(A)):
            for j in range (len(A[0])):
                sum += A[i][j]
        return sum
    
    def cal_total_demand (self):

        sum = 0
        for room in self.data.l_rooms:
            sum += room.demand1 
            sum += room.demand2

        return sum



