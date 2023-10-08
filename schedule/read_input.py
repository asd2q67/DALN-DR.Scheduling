import sys
sys.path.insert(0,'F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\schedule')
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
    l_demands = []

    path1 = "F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\instance-generator\Doctor.csv"


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
        
            d = Doctor(int(row[0]), row[1], level1, level2 )
            l_doctors.append(d)
    
    'ROOM INFO'
    path2 = "F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\instance-generator\Room.csv"
    with open(path2, 'r') as file2:
        reader = csv.reader(file2)
        next(reader, None)
        for row in reader :

            r = Room (int (row[0]), int (row[1]), int(row[2]))

            l_rooms.append(r)

    path3 = "F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\instance-generator\Day-off.csv"

    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        for row in reader:
            day_off.append(int (row[0]))

    path3 = "F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\instance-generator\Day-ol.csv"

    with open(path3, 'r') as file3:
        reader = csv.reader(file3)
        for row in reader:
            day_ol.append(int (row[0]))
            room_ol.append(int (row[1]))

    path4 = "F:\Document\Đồ án liên ngành\DALN-DR.Scheduling\instance-generator\demand.csv"

    with open(path4,'r') as file4:
        reader = csv.reader(file4)
        next(reader, None)
        for row in reader:

            demand = Demand(int (row[0]),int (row[1]),int (row[2]), int (row[3]))

            l_demands.append(demand)
            

    return Data(l_doctors, l_rooms, day_off, day_ol, room_ol, l_demands)