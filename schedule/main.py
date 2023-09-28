import sys
sys.path.insert(0,'/home/toto/Code/Doctor_scheduling/schedule')
from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room
from solution import Solution
from Solver import Solver

if __name__ == '__main__':
    data = read_input()
    solver = Solver (data)
    
    print (data.get_num_doctors())
    print (data.get_num_rooms())
    print (solver.solution.schedule_matrix)
    solver.init_matrix()

    # solver.run()
    print (solver.solution.schedule_matrix)

    print (data.l_doctors[0].level1)


