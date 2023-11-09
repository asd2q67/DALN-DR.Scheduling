import sys
sys.path.insert(0, 'F:\Document\DALN\DALN1\DALN-DR.Scheduling\cheker')
from Data_checker import Data
from Room_checker import Room
from Doctor_checker import Doctor
import csv
import json
import pandas as pd

class Solution :
    def __init__(self, data : Data):
        self.solution = [[[] for i in range (data.horizon)] for j in range (data.get_num_rooms())]

        self.doctor_analysis = [[[] for j in range (data.horizon)] for i in range (data.get_num_doctors()) ]


    def read_solution (self) :

        path = 'F:\Document\DALN\DALN1\solution.csv'

        with open (path, 'r') as file :
            reader = csv.reader(file)
            next (reader, None)

            count = 0
            for row in reader :
                
                for i in range (len(row )):    
                    # if (i == 0) : continue
                    # print (row[i])
                    self.solution[count][i] = json.loads(row[i])
                count +=1 
