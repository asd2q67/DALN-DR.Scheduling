import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/schedule')
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from solution import Solution
from Solver import Solver

def export_solution (schedule_matrix):
    for i in range (len (schedule_matrix)):
                 
        print (schedule_matrix[i])

if __name__ == '__main__':
    data : Data= read_input()
    solver = Solver (data)
    
    # print (data.get_num_doctors())
    # print (data.get_num_rooms())

    # print (data.orizon)
    # print (data.get_num_demands())
    # print (data.l_doctors[0].name)
    # print (solver.sort_by_workLoad())

    # data.display_stats()
    # print (data.workLoad)
    solver.schedule()
    # print (solver.room_weights)
    # print (data.workLoad)
    solver.solution.statis()
    export_solution(solver.solution.schedule_matrix)
  

    # print ("--------------------")

    # print (export_solution(solver.solution.schedule_matrix))




