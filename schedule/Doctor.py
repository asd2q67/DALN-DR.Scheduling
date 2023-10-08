
class Doctor :
    def __init__(self, docID : int, name : str,  level1 : list, level2 : list) :
        self.doctorId = docID
        self.name = name
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
        self.work_load = {}
        for i in r_list:
            self.work_load[i] = 0
    
    def workload_sum(self):
        ret = 0
        for i in self.work_load:
            ret += self.work_load[i]
        
        return ret

        

        
