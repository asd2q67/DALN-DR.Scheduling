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
        self.obj = sum (self.max_min)

 
    def update_matrix (self, doctor_id , dateID, roomID):
        self.schedule_matrix[roomID][dateID].append(doctor_id)

    
    def statis (self):
        '''
        Export info related to doctors 
        '''

        f = open ('solution.txt', 'w+')
        f.write( "{:7}{:>5}{:>18}{:>20}{:>20}\n".format('DoctorID', "Name", "Possible room","Initial_weights", "Solution_Weights"))

        for doctor in self.data.l_doctors :
            possible_rooms = doctor.level1 + doctor.level2
            possible_rooms.sort()
            
            init_weight = self.data.workLoad[doctor.doctorId]
            solution_weights = self.room_weights[doctor.doctorId]

            f.write ("{:7}{:>5}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, doctor.name, str(possible_rooms), str(init_weight), str(solution_weights)))

    def export_solution (self):
        day_list = ['ca{}'.format(i) for i in range(self.data.horizon)]

        df = pd.DataFrame(self.schedule_matrix, columns=day_list)
        print (df)
            
    def scoring_function (self):
        pass

    def cal_objective (self):




