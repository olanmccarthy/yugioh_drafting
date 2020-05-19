import re

file = open('darks.txt', 'r')
rares = []
commons = []
trReached = False
previousCard = ''
lineCount = 0

for line in file:
    print(line)
    if '<tr>' in line:
        trReached = True
        lineCount = 0
    if lineCount == 2: #card title
        match = re.search(r'title=\"(.*)\">', line)
        previousCard = match.group(1)
    if lineCount == 3: #cardRarity
        match = re.search(r'title=\"(.*)\">.*</a><br', line)
        if match.group(1) == 'Common':
            commons.append(previousCard)
        elif match.group(1) == 'Rare':
            rares.append(previousCard)
        else:
            print('***************** ERROR WITH RARITY OF %s' % previousCard)
        previousCard = ''
    lineCount += 1
print('Rares: %i' % len(rares))
print(rares)
print('Commons: %i' % len(commons))
print(commons)
