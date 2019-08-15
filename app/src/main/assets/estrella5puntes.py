'''
   	Copyright 2019 Pere Nubiola

    This file is part of CatCompass.

    CatCompass is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CatCompass is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CatCompass.  If not, see <https://www.gnu.org/licenses/>.

@package CatCompass.
'''

import math

radius = 14
numor = 1.618

a18 = math.radians(18)
l = radius * math.cos(a18)
b = l/numor
c = l/ math.pow(numor,2)

list=[[1,180],[151,30],[151,180]]

f = open("extrella.txt", "w")
f.write("l=" + str(l) + " b=" + str(b) +" c=" + str(c) + "\n")  
for i in list:
    px0 = i[0]
    py0 = i[1]
    px1n = px0 + c * math.cos(a18)
    px1 =  round(px1n,2)
    py1u = round(py0 - (c * math.sin(a18)),2)
    py1d = round(py0 + (c * math.sin(a18)),2)
    py2u = round(py0 - (c * math.sin(a18)) - c,2)
    py2d = round(py0 + (c * math.sin(a18)) + c,2)
    px3 =  round(px0 + b * math.cos(a18),2)
    py3u = round(py0 - (b * math.sin(a18)),2)
    py3d = round(py0 + (b * math.sin(a18)),2)
    px4 = round(px0 + l * math.cos(a18),2)
    py4u = round(py0 - (l * math.sin(a18)),2)
    py4d = round(py0 + (l * math.sin(a18)),2)
    py5 = py0
    px5 = round(px1n + b * math.sin(math.radians(32)),2)
    f.write( "<polygon points=\"" + str(px0)+","+ str(py0) + " " + str(px1) + "," + str(py1u) + " " + str(px1) + "," + str(py2u) +
            " " + str(px3) + "," + str(py3u) + " " + str(px4) + "," + str(py4u) + " " + str(px5) + "," + str(py5) +
            " " + str(px4) + "," + str(py4d) + " " + str(px3) + "," + str(py3d) + " " + str(px1) + "," + str(py2d) +
            " " + str(px1) + "," + str(py1d) + "\"  fill=\"white\"/> \n")
f.close();
