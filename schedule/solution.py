from Data import Data
import copy
from Doctor import Doctor
from Room import Room
import pandas as pd

class Solution :
    def __init__(self, data : Data):
        self.data = data
        self.schedule_matrix = [[[] for i in range (data.horizon)] for i in range (data.get_num_rooms())]

        # self.night_shift = [[] for i in range (data.horizon/2)]
        self.room_weights = copy.deepcopy(self.data.workLoad) 

        # save list patient can not be assigned for each day
        self.dump = [[] for i in range (int(data.horizon/2))] 

        # max-min (OBJ)
        self.max_min = [0 for i in range (self.data.get_num_doctors())]

        self.deleted_doctor = [[] for d in range (self.data.horizon)]

        self.available_room = [[] for d in range (self.data.horizon)]

        



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
            solution_weights = self.room_weights[doctor.doctorId]

            f.write ("{:<7}{:>25}{:>35}{:>35}{:>35}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(init_weight), str(solution_weights)))

    def export_solution (self):
        day_list = ['{}'.format(i) for i in range(self.data.horizon)]

        df = pd.DataFrame(self.schedule_matrix, columns=day_list)
        df.to_csv('solution.csv', index=False)
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
        print (df)
                

    def cal_max_min (self):
        for doctorID in range (self.data.get_num_doctors()):
            self.max_min[doctorID] = max (self.room_weights[doctorID]) - min(self.room_weights[doctorID])

    def delete_doctor (self, doctorID, roomID, day):
        self.deleted_doctor[day].append(doctorID)

        self.schedule_matrix[roomID][day].remove(doctorID)
        self.room_weights[doctorID][roomID] -= self.data.l_rooms[roomID].heavy

        self.max_min[doctorID] = max (self.room_weights[doctorID]) - min(self.room_weights[doctorID])

        self.available_room[day].append(roomID)
        self.update_obj()

    def insert_doctor (self, doctorID, roomID, day):
        self.deleted_doctor[day].remove(doctorID)

        self.update_matrix(doctorID,day,roomID)
        self.room_weights[doctorID][roomID] += self.data.l_rooms[roomID].heavy
        self.max_min[doctorID] = max (self.room_weights[doctorID]) - min(self.room_weights[doctorID])

        self.update_obj()

    def update_obj (self):
        self.cal_max_min()
        # self.obj = sum(self.max_min)

    def get_obj (self):
        obj = sum(self.max_min)
        return obj


