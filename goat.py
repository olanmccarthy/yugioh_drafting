file = open('darks.txt')
list = []

for line in file:
    list.append(line.rstrip())

print(list)
