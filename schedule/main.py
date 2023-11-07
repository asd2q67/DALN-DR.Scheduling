import sys
sys.path.insert(0,'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\schedule')
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
    
    # print (data.get_num_doctors())
    # for i in data.l_doctors:
    #     print (i.doctorId, " - ",i.level1 , " - ", i.level2)

    # print (data.orizon)
    # print (data.get_num_demands())
    # print (data.l_doctors[0].name)
    # print (solver.sort_by_workLoad())
    # solver.init_matrix()



    # data.display_stats()
    # print (data.workLoad)
    # solver.build_initial_solution(solver.best_solution)
    solver.schedule()
    # print (solver.room_weights)
    # print (data.workLoad)
    solver.best_solution.statis()

    solver.best_solution.export_solution()
    # print (solver.current_solution.dump)
    # export_solution()
  

    temp = solver.solution.schedule_matrix.copy()
    day_id = [i for i in range(14)]
    for i in range (len (temp)):
        for j in range (len (temp[0])):
            for k in range (len(temp[i][j]) ):
                temp [i][j][k] = data.l_doctors[temp[i][j][k]].doctorId
    
    with open ('solution.csv', 'w', newline='') as f :    
        write = csv.writer(f)
        write.writerow(day_id)
    
    with open ('solution.csv', 'a', newline='') as f :
        write = csv.writer(f)
            
        # write.writerows(solver.solution.schedule_matrix)
        
        write.writerows(temp)





    # print (data.l_doctors[0].level1)
    # for i in solver.sort_doc(data.l_doctors):
    #     print(i.doctorId , ' - ', i.work_load)
    # for i in solver.sort_dict(data.l_doctors[0].work_load):
    #     print(i)



