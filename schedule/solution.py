from Data import Data

from Doctor import Doctor
from Room import Room
import numpy as np
import pandas as pd

class Solution :
    def __init__(self, data : Data):
        self.schedule_matrix = [[[] for i in range (data.horizon)] for i in range (data.get_num_rooms())]

        # self.night_shift = [[] for i in range (data.horizon/2)]

    def update_matrix (self, doctor_id , dateID, roomID):
        self.schedule_matrix[roomID][dateID].append(doctor_id)

        

