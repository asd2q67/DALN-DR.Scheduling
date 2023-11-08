import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/cheker')

from Data_checker import Data
from Room_checker import Room
from Doctor_checker import Doctor
from Checker import Checker
from read_input_checker import read_input_checker
import pandas as pd

def export_by_doctor (checker : Checker):
    
    day_list = ['{}'.format(i) for i in range(checker.data.horizon)]

    df = pd.DataFrame(checker.solution.doctor_analysis, columns=day_list)
    df.to_csv('doctor_calendar.csv', index=False)
    print (df)


if __name__ == '__main__':
    data : Data= read_input_checker()
    
    checker = Checker(data)
    checker.solution.read_solution()

    # print (checker.data.l_doctors[0].name)

    
    checker.check()

    # day_list = ['ca{}'.format(i) for i in range(data.horizon)]

    # df = pd.DataFrame(checker.solution.solution, columns=day_list)
    # print (df)

    # print ("\n")
    # checker.check()


