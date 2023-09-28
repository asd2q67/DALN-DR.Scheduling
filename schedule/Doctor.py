
class Doctor :
    def __init__(self, docID : int, name : str, workLoad :int, level1 : list, level2 : list) :
        self.doctorId = docID
        self.name = name
        self.work_load = workLoad
        'list of rooms doctor can work as level 1'
        self.level1 = level1
        'list of rooms doctor can work as level 2'
        self.level2 = level2

        
