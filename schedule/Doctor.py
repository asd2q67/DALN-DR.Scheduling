import csv

class Doctor :
    def __init__(self, docID : int,  level1 : list, level2 : list, workLoad : list) :
        self.doctorId = docID
        'list of rooms doctor can work as level 1'
        self.level1 = level1
        'list of rooms doctor can work as level 2'
        self.level2 = level2
        r_list = []
        for i in level1:
            r_list.append(i)
        for i in level2:
            r_list.append(i)
        r_list = sorted(r_list)
        self.work_load = workLoad

    def workload_sum(self):
        return sum(self.work_load)

                
            


        

        
