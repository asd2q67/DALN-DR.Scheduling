import sys
sys.path.insert(0,'F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\schedule')
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from solution import Solution
from Solver import Solver
# import pandas as pd

if __name__ == '__main__':
    data = read_input()
    solver = Solver (data)
    
    # print (data.get_num_doctors())
    # print (data.get_num_rooms())
    # print (data.get_num_demands())
    # print (data.l_doctors[0].name)
    # print (solver.solution.schedule_matrix)
    solver.init_matrix()

    solver.run1()
    df = pd.DataFrame(solver.solution.schedule_matrix)
    # df.to_csv("lich.csv")
    # print(solver.solution.schedule_matrix)

    # print (data.l_doctors[0].level1)
    # for i in solver.sort_doc(data.l_doctors):
    #     print(i.doctorId , ' - ', i.work_load)
    # for i in solver.sort_dict(data.l_doctors[0].work_load):
    #     print(i)



