import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/schedule')
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from solution import Solution
from Solver import Solver

def export_solution ():
    path = '/home/toto/Code/DALN-DR.Scheduling/cheker/solution.csv'

    num_day = 7
    num_room = 7

    solution = [[[] for i in range (7)] for j in range (7)]

    with open (path, 'r') as file :
        reader = csv.reader(file)
        next (reader, None)

        count = 0
        for row in reader :
            
            for i in range (len(row )):    
                if (i == 0) : continue
                # print (row[i])
                solution[count][i - 1] = row[i]
            count +=1 
    print (solution)

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
    solver.build_initial_solution(solver.best_solution)
    # print (solver.room_weights)
    # print (data.workLoad)
    solver.current_solution.statis()

    solver.current_solution.export_solution()
    # print (solver.current_solution.dump)
    # export_solution()
  

    # print ("--------------------")

    # print (export_solution(solver.solution.schedule_matrix))




