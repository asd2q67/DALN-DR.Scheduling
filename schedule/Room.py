class Room : 
    def __init__(self, roomID : int, heavy , pri : int, de0 : int, de1 : int,  de2 : int) :
        self.roomID = roomID
        self.heavy = heavy
        self.priority = pri

        'number of doctor required for each level'
        self.demand0 = de0
        self.demand1 = de1
        self.demand2 = de2
        