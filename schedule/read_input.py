import sys
sys.path.insert(0,'/home/toto/Code/Doctor_scheduling/schedule')
from Data import Data
import csv
from Doctor import Doctor
from Room import Room


def read_input () -> Data:

    l_doctors = []
    l_rooms = []
    day_off = []
    day_ol = []

    path1 = "instance-generator/Doctor.csv"


    'DOCTOR INFO'
    with open(path1, 'r') as file1:
        reader = csv.reader(file1)
        next(reader, None)
        for row in reader :
            level1 = []
            level2 = []

            '''
                read line by line
                filter which room belongs to level1, level2
            '''
            for i in range (2, len(row)):
                if (int(row[i]) == 1):
                    level1.append(i - 2)
                elif (int(row[i]) == 2):
                    level2.append(i - 2)
        
            d = Doctor(int(row[0]), row[1], int (row[2]), level1, level2 )
            l_doctors.append(d)
    
    'ROOM INFO'
    path2 = "instance-generator/Doctor.csv"
    with open(path2, 'r') as file2:
        reader = csv.reader(file2)
        next(reader, None)
        for row in reader :

            r = Room (int (row[0]), row[1], int(row[2]), int (row[3]), int (row[4]), int(row[5]))

            l_rooms.append(r)

    path3 = "instance-generator/Day-off.csv"

    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        for row in reader:
            day_ol.append(int (row[0]))
            day_off.append(int (row[1]))
        

    return Data(l_doctors, l_rooms, day_off, day_ol)