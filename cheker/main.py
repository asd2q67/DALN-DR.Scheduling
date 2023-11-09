import sys
sys.path.insert(0,'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\cheker')

from Data_checker import Data
from Room_checker import Room
from Doctor_checker import Doctor
from Checker import Checker
from read_input_checker import read_input_checker
import pandas as pd
    



if __name__ == '__main__':
    data : Data= read_input_checker()
    
    checker = Checker(data)
    checker.solution.read_solution()

    # checker.check()

    day_list = ['ca{}'.format(i) for i in range(data.horizon)]

    df = pd.DataFrame(checker.solution.solution, columns=day_list)
    print (df)

    print ("\n")
    checker.check()
    checker.print_demand()
    # print (data.day_off)


