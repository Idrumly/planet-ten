"""Original Planet Ten character asset. Run with Blender --background --python.
Builds an editable subdivision model, embedded botanical textures and web GLB.
No third-party character meshes or reference-image pixels are included.
"""
import bpy, math, os, sys, json
import numpy as np
from mathutils import Vector

OUT = os.environ.get('PLANET_TEN_ASSET_OUT', os.path.dirname(__file__) + '/../assets/puddlehopper')
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for data in list(bpy.data.materials): bpy.data.materials.remove(data)
parts=[]

def texture(name, petal=False, face=False):
    n=1024; y,x=np.mgrid[0:n,0:n].astype(np.float32)/(n-1)
    rng=np.random.default_rng(41 if petal else 29)
    noise=rng.random((n,n)).astype(np.float32)
    ridge=np.exp(-((x-.5)/.008)**2)
    branching=np.exp(-(np.sin((y+abs(x-.5)*.68)*math.pi*13)/.10)**2)*(1-ridge)*.35
    fine=np.sin(x*330+y*21)*.013+noise*.025
    h=.13*ridge+.055*branching+fine
    if face:h=noise*.006
    stops=([(.16,.32,.22),(.54,.16,.31),(.82,.37,.47),(.98,.79,.60)] if petal else [(.045,.14,.11),(.12,.31,.23),(.30,.48,.31),(.57,.66,.39)])
    if face:stops=[(.19,.32,.19),(.27,.43,.26),(.32,.48,.28),(.39,.50,.29)]
    color=np.zeros((n,n,3),np.float32)
    for k in range(3): color[:,:,k]=np.interp(y,[0,.23,.70,1],[s[k] for s in stops])
    mottling=(np.sin(x*47+np.sin(y*23)*2)*np.sin(y*70+x*29)*.025+noise*.035)
    color+=mottling[:,:,None]+ridge[:,:,None]*(0 if face else .06)+branching[:,:,None]*(0 if face else .025)
    if face:color[noise>.993]*=.65
    if petal:
        freckles=(noise>.997)*(np.sin(y*97+x*177)>.2)*(y<.65)
        color[freckles]*=.60
    def image(label,pixels,space):
        im=bpy.data.images.new(label,width=n,height=n,alpha=True)
        rgba=np.ones((n,n,4),np.float32);rgba[:,:,:3]=np.clip(pixels,0,1)
        im.colorspace_settings.name=space;im.pixels.foreach_set(rgba.ravel());im.update()
        im.filepath_raw=os.path.join(OUT,label+'.png');im.file_format='PNG';im.save();im.pack();return im
    albedo=image(name+'-colour',color,'sRGB')
    dy,dx=np.gradient(h);norm=np.stack([-dx*12,-dy*12,np.ones_like(h)],axis=-1)
    norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
    normal=image(name+'-normal',norm*.5+.5,'Non-Color')
    rough=np.repeat((.56+noise*.12)[:,:,None],3,axis=2)
    roughness=image(name+'-roughness',rough,'Non-Color')
    return albedo,normal,roughness

def material(name,color,rough=.5,textures=None):
    m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
    if textures:
        for im,target in zip(textures,['Base Color','Normal','Roughness']):
            node=m.node_tree.nodes.new('ShaderNodeTexImage');node.image=im
            if target=='Normal':
                nm=m.node_tree.nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.5
                m.node_tree.links.new(node.outputs['Color'],nm.inputs['Color']);m.node_tree.links.new(nm.outputs['Normal'],p.inputs[target])
            else:m.node_tree.links.new(node.outputs['Color'],p.inputs[target])
    return m
leaf=material('Leaf • emerald wax and fine veins',(1,1,1),textures=texture('leaf'))
petal=material('Petal • rose, cream and pollen freckles',(1,1,1),textures=texture('petal',True))
skin=material('Face • soft sage',(.25,.43,.25),.65)
face_skin=material('Face • botanical freckles',(1,1,1),textures=texture('face',face=True))
stem=material('Stem • deep jade',(.08,.23,.16),.63)
gold=material('Pollen • antique gold',(.61,.39,.10),.45)
dark=material('Eye and mouth recess',(.012,.031,.026),.3)
iris=material('Iris • honey amber',(.54,.26,.035),.22)
shine=material('Eye catchlight',(.95,.91,.72),.15)

def finish(obj,name,mat):
    obj.name=name;obj.data.materials.append(mat);parts.append(obj)
    if obj.type=='MESH':
        for p in obj.data.polygons:p.use_smooth=True
    return obj

def ellipsoid(name,loc,scale,mat,segments=32,rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc)
    o=bpy.context.object;o.scale=scale;finish(o,name,mat)
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return o

def tube(name,points,radius,mat=stem):
    curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.resolution_u=12;curve.bevel_depth=radius;curve.bevel_resolution=3
    s=curve.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points):p.co=co;p.handle_left_type=p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o);return finish(o,name,mat)

def blade(name,base,tip,width,mat=leaf,cup=.12,ruffle=.025):
    # Organic thick petal with a curved spine, hand-shaped edge and authored UVs.
    base,tip=Vector(base),Vector(tip);direction=tip-base
    sideways=Vector((direction.z,0,-direction.x)).normalized()
    verts=[];uv=[];faces=[];N=24;M=12
    for j in range(N+1):
        v=.002+.996*j/N
        center=base+direction*v;center.y-=math.sin(math.pi*v)*cup
        w=width*math.sin(math.pi*v)**.72*(1+.065*math.sin(v*27))
        for i in range(M+1):
            u=i/M*2-1;p=center+sideways*(u*w)
            p.y+=u*u*.10*math.sin(math.pi*v)+abs(u)**4*ruffle*math.sin(v*33)
            p.y+=v**6*.12
            verts.append(tuple(p));uv.append((i/M,j/N))
            if i<M and j<N:
                a=j*(M+1)+i;faces.append((a,a+1,a+M+2,a+M+1))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    layer=mesh.uv_layers.new(name='BotanicalUV')
    for poly in mesh.polygons:
        for loop in poly.loop_indices:layer.data[loop].uv=uv[mesh.loops[loop].vertex_index]
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);finish(o,name,mat)
    sub=o.modifiers.new('Sculpted surface smoothing','SUBSURF');sub.levels=1
    solid=o.modifiers.new('Living tissue thickness','SOLIDIFY');solid.thickness=.009;solid.offset=0
    return o

# Branching body, roots and shoulder structure are fused into one continuous skin.
body=[]
body.append(ellipsoid('Torso volume',(0,.06,1.55),(.25,.20,.57),stem))
body.append(ellipsoid('Neck volume',(0,.035,2.12),(.11,.12,.22),stem))
for side in [-1,1]:
    body.append(tube('Root leg',[(side*.13,.05,1.20),(side*.22,.07,.65),(side*.22,-.02,.15),(side*.39,-.22,.065)],.075))
    body.append(ellipsoid('Root foot',(side*.30,-.16,.075),(.13,.27,.065),stem))
    body.append(tube('Branch arm',[(side*.19,.04,1.86),(side*.43,.015,1.68),(side*.65,-.08,1.80),(side*.77,-.14,1.96)],.052))
    body.append(ellipsoid('Palm',(side*.77,-.14,1.96),(.065,.045,.10),stem))
    for f in range(3):tube('Tendril finger',[(side*(.75+f*.025),-.14,1.98),(side*(.76+f*.06),-.15,2.08),(side*(.73+f*.085),-.13,2.14-f*.018)],.014)
bpy.ops.object.select_all(action='DESELECT')
for o in body:o.select_set(True)
bpy.context.view_layer.objects.active=body[0];bpy.ops.object.convert(target='MESH');bpy.ops.object.join()
body_obj=bpy.context.object;body_obj.name='Puddlehopper • continuous branching body'
remesh=body_obj.modifiers.new('Organic joint fusion','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.018;bpy.ops.object.modifier_apply(modifier=remesh.name)
smooth=body_obj.modifiers.new('Soft tissue sculpt','SMOOTH');smooth.factor=.8;smooth.iterations=5;bpy.ops.object.modifier_apply(modifier=smooth.name)
for p in body_obj.data.polygons:p.use_smooth=True

# Layered leaf coat, collar and arm cuffs.
for i in range(9):
    a=i*math.tau/9
    blade('Coat leaf %02d'%i,(math.sin(a)*.13,math.cos(a)*.13+.04,1.48),(math.sin(a)*(.37+(i%2)*.07),math.cos(a)*.31+.04,.42+(i%3)*.13),.19,cup=.08)
for side in [-1,1]:
    blade('Shoulder collar', (0,.04,2.03),(side*.47,-.02,1.73),.16,cup=.09)
    blade('Forearm leaf cuff',(side*.40,0,1.73),(side*.70,-.13,1.94),.12,cup=.04)
    blade('Chest lapel',(side*.16,-.10,1.92),(side*.08,-.25,1.17),.13,cup=.045)

# Deliberately unequal crown petals: a hood, side lobes and curling lower sepals.
crown_specs=[(-.30,3.55,.29),(.12,3.72,.30),(.43,3.45,.32),(-.69,3.18,.31),(.76,3.08,.32),(-.80,2.72,.27),(.83,2.57,.28)]
for i,(x,z,w) in enumerate(crown_specs):
    blade('Crown petal %02d'%i,(x*.17,.16,2.42),(x,.12+(i%3)*.07,z),w,petal,cup=.20+(i%2)*.06,ruffle=.035)
for side in [-1,1]:
    blade('Rolled cheek petal',(side*.15,.035,2.55),(side*.60,-.005,2.26),.19,petal,cup=.13)
    blade('Lower blossom collar',(side*.14,.03,2.39),(side*.39,-.08,2.02),.17,petal,cup=.12)
    tube('Curling crown tendril',[(side*.21,.13,2.86),(side*.48,.18,3.22),(side*.76,.15,3.30),(side*.82,.10,3.20)],.012,gold)

# Shaped face. Vertex displacement defines cheek pads, brow and recessed eye beds.
head=ellipsoid('Face sculpt',(0,-.055,2.49),(.265,.235,.365),face_skin,64,48)
for v in head.data.vertices:
    x,y,z=v.co
    if y<0:
        weight=max(0,-y/.235)
        sockets=sum(math.exp(-((x-side*.112)/.075)**2-((z-.065)/.07)**2) for side in [-1,1])
        cheek=sum(math.exp(-((x-side*.14)/.10)**2-((z+.06)/.11)**2) for side in [-1,1])
        v.co.y+=sockets*.035*weight-cheek*.019*weight
    v.co.x*=1-.18*max(0,-z/.365)
for side in [-1,1]:
    x=side*.113
    ellipsoid('Recessed eye', (x,-.276,2.555),(.078,.035,.057),dark)
    ellipsoid('Amber iris',(x,-.308,2.552),(.039,.011,.044),iris)
    ellipsoid('Vertical pupil',(x,-.319,2.552),(.015,.006,.032),dark)
    ellipsoid('Eye glint',(x-.012,-.325,2.57),(.009,.004,.009),shine,16,12)
    tube('Upper leaf eyelid',[(x-.078,-.285,2.555),(x-.015,-.316,2.613),(x+.077,-.283,2.568)],.013,skin)
    tube('Lower leaf eyelid',[(x-.070,-.281,2.548),(x,-.306,2.504),(x+.070,-.283,2.555)],.009,skin)
    tube('Botanical brow',[(x-.085,-.258,2.638),(x,-.275,2.665),(x+.070,-.25,2.63)],.006,stem)
ellipsoid('Nose ridge',(0,-.287,2.475),(.026,.025,.062),skin)
tube('Mouth crease',[(-.073,-.263,2.365),(0,-.283,2.348),(.079,-.255,2.373)],.009,dark)
tube('Lower lip tissue',[(-.052,-.261,2.34),(0,-.274,2.329),(.055,-.258,2.347)],.008,skin)
for i in range(13):
    a=i*2.4;ellipsoid('Pollen crown bead',(math.sin(a)*.12,-.20,2.75+(i%3)*.027),(.012,.010,.019),gold,12,8)

# Stable logical anchors for later clue integration; this asset studio has no game state.
for name,loc in [('anchor_sentence',(-.33,-.12,3.17)),('anchor_definition',(.38,-.12,3.15)),('anchor_show',(-.57,-.12,2.72)),('anchor_human',(.57,-.12,2.68)),('anchor_history',(-.25,-.22,1.13)),('anchor_part_of_speech',(.25,-.22,1.13)),('anchor_hear',(0,-.28,1.76)),('anchor_test',(0,-.25,.73))]:
    o=bpy.data.objects.new(name,None);o.location=loc;bpy.context.collection.objects.link(o)

# Keep the editable source, then export evaluated geometry/materials to glTF.
for obj in bpy.context.scene.objects:
    if obj.type=='MESH':
        for p in obj.data.polygons:p.use_smooth=True
scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.render.engine='CYCLES'
scene.world.color=(.14,.14,.14)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'puddlehopper-source.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'puddlehopper.glb'),export_format='GLB',export_apply=True,export_animations=False,export_yup=True)
print('PLANET_TEN_ASSET_DONE '+OUT)
