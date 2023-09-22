import sys
sys.path.insert(0,'/home/toto/Code/Doctor_scheduling/schedule')

from Data import Data
from read_input import read_input
import csv
from Doctor import Doctor
from Room import Room



class Solver:
    def __init__(self, data : Data):
        self.data: Data = data

if __name__ == '__main__':
    data = read_input()
    print (data.get_num_doctors())

    