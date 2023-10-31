import sys
sys.path.insert(0,"F:\Document\DALN\DALN-DR.Scheduling\schedule")
from Data import Data
import csv
from Doctor import Doctor
from Room import Room
from Demand import Demand


def read_input () -> Data:

    l_doctors = []
    l_rooms = []
    day_off = []
    day_ol = []
    room_ol = []
    workLoad = []


    path = "F:\Document\DALN\DALN-DR.Scheduling\instance-generator\\"

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
            # print(len(workLoad) , " - " ,int(row[0]) )
            
            d = Doctor(int(row[0]), level1, level2, workLoad[int(row[0]) - 1])
            l_doctors.append(d)
    
    'ROOM INFO'
    path2 = path + "Room.csv"
    with open(path2, 'r') as file2:
        reader = csv.reader(file2)
        next(reader, None)
        for row in reader :

            r = Room (int (row[0]), int (row[1]), int(row[2]), int(row[3]), int(row[4]))

            l_rooms.append(r)

    path3 = path +  "Day-off.csv"

    off = [[] for i in range (14)]
    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        id = 0
        for row in reader :
            if (id not in off[int(row[0])] ):
                off[int (row[0])].append(id)
            else :
                off[int (row[0])] = id
            id += 1

    path3 = path + "Day-ol.csv"

    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        next(reader, None)
        for row in reader:
            day_ol.append(int (row[0]))
            room_ol.append(int (row[1]))

    

    return Data(l_doctors, l_rooms, off, day_ol, room_ol, )