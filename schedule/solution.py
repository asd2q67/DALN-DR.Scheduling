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

    def update_matrix (self, doctor_id , dateID, roomID):
        self.schedule_matrix[roomID][dateID].append(doctor_id)

    
    def statis (self):
        '''
        Export info related to doctors 
        '''

        f = open ('solution.txt', 'w+')
        f.write( "{:7}{:>18}{:>20}{:>20}\n".format('DoctorID', "Possible room","Initial_weights", "Solution_Weights"))

        for doctor in self.data.l_doctors :
            possible_rooms = doctor.level1 + doctor.level2
            possible_rooms.sort()
            
            init_weight = self.data.workLoad[doctor.doctorId]
            solution_weights = self.room_weights[doctor.doctorId]

            f.write ("{:7}{:>18}{:>20}{:>20}\n".format(doctor.doctorId, str(possible_rooms), str(init_weight), str(solution_weights)))

    def export_solution (self):
        day_list = ['ca{}'.format(i) for i in range(self.data.horizon)]

        df = pd.DataFrame(self.schedule_matrix, columns=day_list)
        print (df)
            
                                



