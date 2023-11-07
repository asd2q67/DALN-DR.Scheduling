import sys
sys.path.insert(0,'/home/toto/Code/DALN-DR.Scheduling/schedule/')
from Data import Data
import csv
from Doctor import Doctor
from Room import Room

num_day = 14


def read_input () -> Data:

    l_doctors = []
    l_rooms = []
    day_off = []
    day_ol = []
    room_ol = []
    workLoad = []


    path = '/home/toto/Code/DALN-DR.Scheduling/instance-generator/'

    path4 =  path + 'Workload.csv'

    with open(path4, 'r') as file4:
        reader = csv.reader(file4)
        next(reader, None)

        for row in reader:
            A = [int(row[i]) for i in range (len(row))]

            workLoad.append(A)


    path1 = path +  "Doctor.csv"


    'DOCTOR INFO'
    with open(path1, 'r') as file1:
        reader = csv.reader(file1)
        next(reader, None)
        count = 0
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
        
            d = Doctor(int(row[0]), row[1], level1, level2, workLoad[count])
            l_doctors.append(d)
            count += 1
    
    'ROOM INFO'
    path2 = path + "Room.csv"
    with open(path2, 'r') as file2:
        reader = csv.reader(file2)
        next(reader, None)
        for row in reader :

            r = Room (int (row[0]), int (row[1]), int(row[2]), int(row[3]))

            l_rooms.append(r)

    path3 = path +  "Day-off.csv"

    off = [[] for i in range (num_day)]
    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        next(reader, None)
        for row in reader :
            if (int(row[0]) not in off[int(row[1])] ):
                off[int (row[1])].append(int (row[0]))
            else :
                off[int (row[1])] = int (row[0])

    ol = [[] for i in range (num_day)]
    path3 = path + "Day-ol.csv"

    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        next(reader, None)
        for row in reader:       
            room_ol.append(int (row[1]))
            day_ol.append(int (row[2]))

            if (int(row[0]) not in ol[int(row[1])]):
                ol[int (row[1])].append(int (row[0]))
            else :
                ol[int (row[1])] = int (row[0])

            

    

    return Data(l_doctors, l_rooms, off, day_ol, room_ol, workLoad)