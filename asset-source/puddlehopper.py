"""Original Planet Ten character asset. Run with Blender --background --python.
Builds an editable subdivision model, embedded botanical textures and web GLB.
No third-party character meshes or reference-image pixels are included.
"""
import bpy, math, os, sys, json
import numpy as np
from mathutils import Vector, Matrix

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
    if face:
        # Face UVs are authored from the sculpt's width/height, so pigment follows anatomy.
        u=x*2-1;v=y*2-1
        pollen=np.exp(-(u/.60)**2-((v-.02)/.88)**2)
        color=color*(1-pollen[:,:,None]*.68)+np.array([.70,.65,.29])*pollen[:,:,None]*.68
        cheeks=(np.exp(-((u-.53)/.25)**2-((v+.20)/.22)**2)+np.exp(-((u+.53)/.25)**2-((v+.20)/.22)**2))*.28
        color=color*(1-cheeks[:,:,None])+np.array([.65,.34,.25])*cheeks[:,:,None]
        edge=np.clip((abs(u)-.50)*1.4,0,.55)
        color=color*(1-edge[:,:,None])+np.array([.12,.29,.19])*edge[:,:,None]
        leaflines=np.exp(-(np.sin((v+abs(u)*.8)*15)/.09)**2)*np.clip((abs(u)-.35)*1.7,0,1)
        color-=leaflines[:,:,None]*.025
        color[(noise>.997)&(abs(v)<.5)]*=.75
        # Sweeping pigment bands grow outwards from the bridge of the nose.
        # Broad translucent washes and finer veins share the same curved direction.
        sweep=abs(u)-(.16+.48*np.clip(v+.25,0,1.3))
        copper=np.exp(-(sweep/.20)**2)*np.clip((v+.50)*1.3,0,.82)
        color=color*(1-copper[:,:,None])+np.array([.72,.25,.11])*copper[:,:,None]
        plum=np.exp(-((sweep-.23)/.16)**2)*np.clip((v+.25)*1.1,0,.64)
        color=color*(1-plum[:,:,None])+np.array([.30,.095,.19])*plum[:,:,None]
        coral=np.exp(-((abs(u)-.62)/.24)**2-((v+.2)/.32)**2)*.55
        color=color*(1-coral[:,:,None])+np.array([.77,.35,.23])*coral[:,:,None]
        jade=np.exp(-((u+.055*np.sin(v*7))/.12)**2)*np.clip((v+.25),0,.55)
        color=color*(1-jade[:,:,None])+np.array([.20,.60,.43])*jade[:,:,None]
        goldline=np.exp(-((sweep+.11)/.035)**2)*np.clip((v+.3),0,.25)
        color+=goldline[:,:,None]*np.array([.35,.25,.08])
        color+=np.sin(u*26+v*11)[:,:,None]*.012
        fibres=np.exp(-(np.sin(u*67+np.sin(v*12)*1.2)/.22)**2)
        cells=np.sin(u*155+v*17)*np.sin(v*133-u*21)
        h=noise*.002+leaflines*.016+goldline*.018+fibres*.013+cells*.003
        color-=fibres[:,:,None]*.010
    if petal:
        warm=np.exp(-((x-.22-.10*np.sin(y*7))/.19)**2)*np.sin(y*math.pi)*.32
        color=color*(1-warm[:,:,None])+np.array([.87,.43,.18])*warm[:,:,None]
        jade=np.exp(-((x-.75)/.13)**2)*(1-y)**2*.48
        color=color*(1-jade[:,:,None])+np.array([.18,.45,.30])*jade[:,:,None]
        freckles=(noise>.997)*(np.sin(y*97+x*177)>.2)*(y<.65)
        color[freckles]*=.60
        # Orchid nectar guides: branching veins and irregular pigmented spots.
        vein=np.exp(-(np.sin((y+abs(x-.5)*.8)*math.pi*18+.35*np.sin(x*35))/.13)**2)
        stemline=np.exp(-((x-.5)/.012)**2)
        guides=np.maximum(vein*.55,stemline)*np.maximum(0,np.sin(y*math.pi))**.5
        color=color*(1-guides[:,:,None]*.40)+np.array([.42,.09,.24])*guides[:,:,None]*.40
        spots=np.zeros_like(x)
        for _ in range(165):
            sx,sy=rng.uniform(.06,.94),rng.uniform(.06,.68)
            rx,ry=rng.uniform(.004,.013),rng.uniform(.004,.018)
            spots=np.maximum(spots,np.exp(-(((x-sx)/rx)**2+((y-sy)/ry)**2)*2))
        color=color*(1-spots[:,:,None]*.65)+np.array([.36,.055,.17])*spots[:,:,None]*.65
        rim=np.clip((abs(x-.5)-.41)/.09,0,1)*.52
        color=color*(1-rim[:,:,None])+np.array([.98,.78,.55])*rim[:,:,None]
        h+=guides*.040+spots*.008
    def image(label,pixels,space):
        im=bpy.data.images.new(label,width=n,height=n,alpha=True)
        rgba=np.ones((n,n,4),np.float32);rgba[:,:,:3]=np.clip(pixels,0,1)
        im.colorspace_settings.name=space;im.pixels.foreach_set(rgba.ravel());im.update()
        im.filepath_raw=os.path.join(OUT,label+'.png');im.file_format='PNG';im.save();im.pack();return im
    albedo=image(name+'-colour',color,'sRGB')
    dy,dx=np.gradient(h);relief=65 if face else 12
    norm=np.stack([-dx*relief,-dy*relief,np.ones_like(h)],axis=-1)
    norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
    normal=image(name+'-normal',norm*.5+.5,'Non-Color')
    rough=np.repeat((.56+noise*.12)[:,:,None],3,axis=2)
    if face:rough=np.repeat(np.clip(.57+fibres*.13+cells*.055+noise*.045,.45,.85)[:,:,None],3,axis=2)
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
skin=material('Face • soft sage',(.38,.49,.25),.65)
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

# Elfin head: narrow jaw, angular cheek planes and an integrated nose bridge.
before_face=set(bpy.data.objects)
levels=[-.40,-.35,-.28,-.20,-.10,.015,.09,.17,.25,.32,.365]
widths=[.012,.055,.095,.143,.185,.226,.232,.207,.195,.155,.012]
depths=[.018,.060,.092,.125,.151,.175,.181,.181,.17,.12,.012]
def face_y(x,z):
    w=float(np.interp(z,levels,widths));d=float(np.interp(z,levels,depths))
    y=-d*math.sqrt(max(0,1-(x/max(w,.001))**2))
    sockets=sum(math.exp(-((x-side*.10)/.065)**2-((z-.065)/.045)**2) for side in [-1,1])
    cheek=sum(math.exp(-((x-side*.15)/.055)**2-((z+.035)/.055)**2) for side in [-1,1])
    bridge=math.exp(-(x/.032)**2-((z+.015)/.125)**2)
    tip=math.exp(-(x/.038)**2-((z+.105)/.040)**2)
    muzzle=math.exp(-(x/.085)**2-((z+.205)/.045)**2)
    return y+sockets*.022-cheek*.018-bridge*.060-tip*.034-muzzle*.015-.055
head=ellipsoid('Face sculpt',(0,-.055,2.49),(.265,.235,.365),face_skin,96,64)
for vert in head.data.vertices:
    x,y,z=vert.co;z=z*(.40/.365) if z<0 else z
    theta=math.atan2(x/.265,y/.235)
    w=float(np.interp(z,levels,widths));d=float(np.interp(z,levels,depths))
    nx=w*math.sin(theta);ny=d*math.cos(theta)
    if math.cos(theta)<0:
        base=-d*math.sqrt(max(0,1-(nx/max(w,.001))**2))
        ny+=(face_y(nx,z)+.055-base)*(-math.cos(theta))**2
    vert.co=(nx,ny,z)
for poly in head.data.polygons:
    for loop in poly.loop_indices:
        co=head.data.vertices[head.data.loops[loop].vertex_index].co
        head.data.uv_layers.active.data[loop].uv=((co.x/.265+1)/2,(co.z/.365+1)/2)
for side in [-1,1]:
    x=side*.10;z=.065;ey=face_y(x,z)-.013
    eye=ellipsoid('Almond eye',(x,ey,2.49+z),(.060,.022,.029),dark)
    eye.rotation_euler.y=-side*.16
    ellipsoid('Amber iris',(x,ey-.021,2.49+z),(.022,.008,.025),iris)
    ellipsoid('Vertical pupil',(x,ey-.029,2.49+z),(.008,.004,.019),dark)
    ellipsoid('Eye glint',(x-.008,ey-.034,2.49+z+.010),(.004,.003,.004),shine,16,12)
    inner=x-side*.060;outer=x+side*.060
    tube('Upper leaf eyelid',[(inner,ey+.001,2.543),(x-side*.008,ey-.021,2.584),(outer,ey+.004,2.567)],.006,skin)
    tube('Lower leaf eyelid',[(inner,ey+.001,2.543),(x,ey-.021,2.527),(outer,ey+.004,2.567)],.005,skin)
    tube('Upper botanical brow',[(side*.040,ey-.005,2.613),(side*.11,ey-.004,2.625),(side*.18,ey+.030,2.617)],.006,skin)
    blade('Temple sepal',(side*.14,-.07,2.81),(side*.22,-.11,2.56),.070,leaf,cup=.035,ruffle=.008)
    blade('Forehead sepal',(side*.08,-.06,2.85),(side*.10,-.20,2.70),.060,leaf,cup=.020,ruffle=.006)
    blade('Pointed leaf ear',(side*.185,-.025,2.51),(side*.46,-.025,2.68),.080,leaf,cup=.075,ruffle=.006)
    blade('Ear petal lining',(side*.22,-.080,2.54),(side*.425,-.043,2.65),.043,petal,cup=.025,ruffle=.003)
def lip_point(x,z,forward=.006):return (x,face_y(x,z)-forward,2.49+z)
tube('Mouth crease',[lip_point(-.064,-.202),lip_point(-.026,-.207),lip_point(0,-.212),lip_point(.027,-.207),lip_point(.064,-.200)],.0035,dark)
tube('Upper lip tissue',[lip_point(-.056,-.199),lip_point(-.020,-.192,.008),lip_point(0,-.199,.009),lip_point(.020,-.192,.008),lip_point(.056,-.197)],.0045,skin)
tube('Lower lip tissue',[lip_point(-.050,-.213),lip_point(0,-.226,.009),lip_point(.050,-.212)],.005,skin)
for i in range(5):
    a=i*2.4;ellipsoid('Pollen crown bead',(math.sin(a)*.07,-.17,2.79+(i%3)*.017),(.008,.007,.011),gold,12,8)

# Stable logical anchors for later clue integration; this asset studio has no game state.
# Project a common facial pigment field onto the brows and sepals to blend their joins.
for obj in list(bpy.context.scene.objects):
    if obj.name.startswith(('Growing leaf brow','Temple sepal','Forehead sepal','Upper leaf eyelid','Lower leaf eyelid','Lower lip tissue','Upper lip tissue','Upper botanical brow')):
        if obj.type=='CURVE':
            bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj;bpy.ops.object.convert(target='MESH')
        if not obj.data.uv_layers:obj.data.uv_layers.new(name='FaceBlendUV')
        obj.data.materials.clear();obj.data.materials.append(face_skin)
        for poly in obj.data.polygons:
            for loop in poly.loop_indices:
                co=obj.data.vertices[obj.data.loops[loop].vertex_index].co
                obj.data.uv_layers.active.data[loop].uv=((co.x/.265+1)/2,((co.z-2.49)/.365+1)/2)
# Preserve all approved facial proportions while reducing the head as one assembly.
pivot=Vector((0,0,2.49))
inset=Matrix.Translation(pivot+Vector((0,.055,.035))) @ Matrix.Scale(.82,4) @ Matrix.Translation(-pivot)
for obj in set(bpy.data.objects)-before_face:obj.matrix_world=inset @ obj.matrix_world
# A continuous horseshoe corolla grows forward, then rolls inward around the face.
# Negative Y faces the viewer. The overhanging rim is real geometry, not painted shadow.
verts=[];uv=[];faces=[];N=72;M=24
for j in range(M+1):
    v=j/M
    for i in range(N+1):
        u=i/N;angle=-.38+u*(math.pi+.76)
        radius=.24+.15*math.sin(v*math.pi*.82)
        radius-=.065*v**5
        fold=.012*math.sin(angle*13)*math.sin(v*math.pi)
        x=math.cos(angle)*(radius+fold)
        z=2.54+math.sin(angle)*(radius+.075)
        y=.15-.49*math.sin(v*math.pi/2)+.055*v**7
        y+=.012*math.sin(angle*17)*v**4
        verts.append((x,y,z));uv.append((u,v))
        if i<N and j<M:
            a=j*(N+1)+i;faces.append((a,a+1,a+N+2,a+N+1))
mesh=bpy.data.meshes.new('Orchid cowl');mesh.from_pydata(verts,[],faces);mesh.update()
layer=mesh.uv_layers.new(name='BotanicalUV')
for poly in mesh.polygons:
    for loop in poly.loop_indices:layer.data[loop].uv=uv[mesh.loops[loop].vertex_index]
hood=bpy.data.objects.new('Forward folded orchid cowl',mesh);bpy.context.collection.objects.link(hood);finish(hood,hood.name,petal)
sub=hood.modifiers.new('Soft corolla folds','SUBSURF');sub.levels=1
solid=hood.modifiers.new('Fleshy petal rim','SOLIDIFY');solid.thickness=.014;solid.offset=0
for side in [-1,1]:
    blade('Inner corolla chin cup',(side*.045,.015,2.24),(side*.23,-.30,2.43),.085,petal,cup=.09,ruffle=.012)
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
