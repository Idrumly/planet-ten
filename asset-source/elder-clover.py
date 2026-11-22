"""Elder Clover: original editable Planet Ten character study, Blender 4.5+."""
import bpy, math, os
import numpy as np
from mathutils import Vector
OUT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../assets/elder-clover'))
os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

def mat(name,color,rough=.6):
    m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;return m

def textured(name,colors,kind='cloth'):
    m=mat(name,(1,1,1));n=512;y,x=np.mgrid[0:n,0:n]/(n-1);rng=np.random.default_rng(73);noise=rng.random((n,n))
    t=np.clip(y+.045*np.sin(x*17)+.04*np.sin(y*27),0,1)
    if kind=='stripe':t=.5+.5*np.tanh(np.sin(y*math.pi*8)*8)
    c=np.array(colors[0])[None,None,:]*(1-t[:,:,None])+np.array(colors[1])[None,None,:]*t[:,:,None]
    c*= (.90+noise*.12+.055*np.sin(x*21)*np.sin(y*29))[:,:,None]
    h=noise*.009+np.sin(x*650+y*11)*.008
    if kind=='cloth':h+=np.sin(y*700)*.008
    dy,dx=np.gradient(h);norm=np.stack([-dx*12,-dy*12,np.ones_like(h)],axis=-1);norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
    for label,pix,space,target in [('colour',c,'sRGB','Base Color'),('normal',norm*.5+.5,'Non-Color','Normal')]:
        im=bpy.data.images.new(name+' '+label,width=n,height=n,alpha=True);im.colorspace_settings.name=space
        a=np.ones((n,n,4),np.float32);a[:,:,:3]=np.clip(pix,0,1);im.pixels.foreach_set(a.ravel());im.update();im.pack()
        tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im;p=m.node_tree.nodes.get('Principled BSDF')
        if target=='Normal':
            nm=m.node_tree.nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.4;m.node_tree.links.new(tex.outputs['Color'],nm.inputs['Color']);m.node_tree.links.new(nm.outputs['Normal'],p.inputs[target])
        else:m.node_tree.links.new(tex.outputs['Color'],p.inputs[target])
    return m
fur=textured('Honey ochre velvet',[(.33,.15,.035),(.78,.57,.19)],'fur')
stripe=textured('Amber and charcoal abdomen',[(.075,.055,.032),(.66,.40,.095)],'stripe')
coat=textured('Weathered teal woven waistcoat',[(.055,.13,.12),(.15,.28,.23)])
leather=textured('Chestnut worn leather',[(.13,.055,.025),(.36,.19,.085)])
silver=textured('Silver pollen beard',[(.29,.28,.20),(.79,.77,.60)],'fur')
dark=mat('Deep umber',(.038,.025,.014),.53)
eye=mat('Eye dark glass',(.022,.036,.026),.17)
iris=mat('Amber iris',(.39,.23,.052),.28)
light=mat('Eye glint',(.90,.91,.73),.15)
bronze=mat('Old bronze',(.38,.24,.085),.38)
thread=mat('Ochre stitching',(.53,.37,.16),.8)
wing=mat('Pearl wing membrane',(.44,.64,.58),.36)
wp=wing.node_tree.nodes.get('Principled BSDF');wp.inputs['Alpha'].default_value=.52;wing.surface_render_method='DITHERED';wing.use_backface_culling=False
vein=mat('Wing veins',(.24,.37,.29),.65)
paper=mat('Journal parchment',(.63,.55,.35),.9)

def finish(o,name,m):
    o.name=name;o.data.materials.append(m)
    if o.type=='MESH':
        for p in o.data.polygons:p.use_smooth=True
    return o

def orb(name,loc,scale,m,segments=40,rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,name,m)

def tube(name,pts,r,m):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.resolution_u=10;cu.bevel_depth=r;cu.bevel_resolution=3;cu.use_fill_caps=True;s=cu.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
    for p,co in zip(s.bezier_points,pts):p.co=co;p.handle_left_type=p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);return finish(o,name,m)

def tuft(name,pts,r,m):
    # Tapered swept locks, continuous geometry with directional UVs.
    pts=[Vector(p) for p in pts];vs=[];uv=[];fs=[];N=16;M=10
    for j in range(N+1):
        t=j/N;q=(1-t)**2*pts[0]+2*(1-t)*t*pts[1]+t*t*pts[2];d=(2*(1-t)*(pts[1]-pts[0])+2*t*(pts[2]-pts[1])).normalized();a=d.cross(Vector((0,1,0))).normalized();b=d.cross(a).normalized();rr=r*(.55+.65*math.sin(t*math.pi))*(1-t*.97)
        for i in range(M+1):
            ang=i/M*math.tau;vs.append(q+rr*(a*math.cos(ang)+b*math.sin(ang)));uv.append((i/M,t))
            if i<M and j<N:k=j*(M+1)+i;fs.append((k,k+1,k+M+2,k+M+1))
    return mesh(name,vs,fs,uv,m)

def mesh(name,vs,fs,uv,m):
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();lay=me.uv_layers.new(name='UVMap')
    for p in me.polygons:
        for l in p.loop_indices:lay.data[l].uv=uv[me.loops[l].vertex_index]
    o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o);return finish(o,name,m)

def box(name,loc,scale,m,bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,name,m);b=o.modifiers.new('Soft worn corners','BEVEL');b.width=bevel;b.segments=3;return o

# Grounded, broad-bodied bee with six limbs and a gently stooped stance.
orb('Striped abdomen',(0,.13,1.24),(.57,.43,.64),stripe)
orb('Velvet thorax',(0,.045,1.94),(.47,.34,.48),fur)
for side in [-1,1]:
    tube('Hind leg',[(side*.25,.12,.83),(side*.33,.07,.48),(side*.32,-.07,.17)],.075,dark)
    orb('Walking boot',(side*.33,-.14,.12),(.135,.25,.115),leather)
    orb('Boot sole',(side*.33,-.14,.035),(.14,.25,.028),dark)
    tube('Boot cuff',[(side*.33+.095*math.cos(a),.01+.10*math.sin(a),.26) for a in np.linspace(0,math.tau,20)],.018,leather)
    for z in [.12,.17,.22]:tube('Boot lace',[(side*.33-.07,-.13,z),(side*.33,-.155,z+.025),(side*.33+.07,-.13,z)],.006,thread)
# Upper hands: staff grip on right, open inviting left palm.
tube('Left upper arm',[(-.37,0,2.04),(-.66,-.035,1.82),(-.88,-.18,2.02)],.073,fur)
tube('Right upper arm',[(.37,0,2.04),(.66,-.05,1.85),(.83,-.16,1.98)],.073,fur)
for side in [-1,1]:
    orb('Velvet hand',(side*.87,-.18,2.01),(.105,.065,.11),fur)
    for i in range(3):tube('Hand finger',[(side*(.84+i*.03),-.19,2.04),(side*(.85+i*.05),-.22,2.13),(side*(.83+i*.065),-.23,2.17-i*.02)],.019,fur)
    tube('Lower bee arm',[(side*.44,.045,1.64),(side*.65,-.10,1.41),(side*.39,-.42,1.50)],.054,dark)
    orb('Lower hand',(side*.34,-.43,1.52),(.10,.065,.065),fur)
# Tailored front panels wrap the body instead of hiding the bee silhouette.
for side in [-1,1]:
    vs=[];uv=[];fs=[];N=20;M=18
    for j in range(N+1):
        v=j/N;z=1.37+v*.83;w=.48-.11*v;depth=.39-.10*v
        for i in range(M+1):
            u=i/M;ang=.11+u*1.52;x=side*w*math.sin(ang);y=.04-depth*math.cos(ang)-.025
            zz=z-.08*math.sin(u*math.pi)*(1-v)**4
            vs.append((x,y,zz));uv.append((u,v))
            if i<M and j<N:k=j*(M+1)+i;fs.append((k,k+1,k+M+2,k+M+1))
    panel=mesh('Teal waistcoat panel',vs,fs,uv,coat);sol=panel.modifiers.new('Woven cloth thickness','SOLIDIFY');sol.thickness=.018
    tube('Waistcoat front piping',[(side*.055,-.37,1.38),(side*.05,-.34,1.75),(side*.04,-.28,2.15)],.011,thread)
    tuft('Folded lapel',[(side*.12,-.28,2.20),(side*.30,-.35,2.03),(side*.11,-.37,1.81)],.075,coat)
for z in [1.55,1.75,1.95]:orb('Antique honey button',(.065,-.372+(z-1.55)*.14,z),(.029,.018,.029),bronze,20,12)
# Small journal held by the lower pair of hands.
box('Journal leather cover',(0,-.43,1.48),(.62,.17,.34),leather)
box('Journal page block',(0,-.525,1.49),(.55,.015,.26),paper,.008)
box('Journal strap',(0,-.545,1.48),(.07,.02,.34),leather,.008)
orb('Journal clasp',(0,-.568,1.48),(.027,.012,.035),bronze,20,12)
for z in np.linspace(1.38,1.59,9):tube('Page edges',[(-.26,-.536,z),(-.05,-.537,z)],.0015,thread)

# Sculpted bee face: broad cheeks, brow ridge, warm eyes and a substantial nose.
orb('Elder head',(0,-.02,2.64),(.47,.34,.48),fur,64,40)
for side in [-1,1]:
    orb('Cheek',(side*.24,-.275,2.51),(.18,.11,.17),fur)
    e=orb('Deep kind eye',(side*.19,-.327,2.71),(.125,.065,.105),eye);e.rotation_euler.y=-side*.12
    orb('Honey iris',(side*.18,-.383,2.71),(.060,.015,.070),iris)
    orb('Eye pupil',(side*.18,-.398,2.71),(.029,.010,.050),dark)
    orb('Eye reflection',(side*.18-.018,-.408,2.743),(.014,.006,.018),light,20,12)
    tube('Upper eyelid',[(side*.075,-.355,2.72),(side*.19,-.385,2.82),(side*.31,-.318,2.75)],.022,fur)
    tube('Lower eye fold',[(side*.08,-.35,2.68),(side*.19,-.37,2.60),(side*.31,-.30,2.66)],.015,fur)
    for i in range(6):
        tuft('Swept silver eyebrow',[(side*(.07+i*.027),-.32,2.84),(side*(.14+i*.032),-.38,2.91),(side*(.26+i*.027),-.28,2.84)],.024,silver)
    tube('Antenna',[(side*.22,-.015,3.00),(side*.33,-.015,3.30),(side*.48,-.07,3.38)],.027,dark)
    orb('Antenna sensory tip',(side*.48,-.07,3.38),(.065,.047,.065),fur)
    for i in range(6):
        tuft('Silver side whisker',[(side*.37,-.16,2.72-i*.04),(side*.51,-.21,2.63-i*.05),(side*.43,-.25,2.42-i*.04)],.031,silver)
orb('Nose bridge',(0,-.32,2.65),(.09,.10,.18),fur)
orb('Nose',(0,-.425,2.56),(.115,.105,.078),fur)
for side in [-1,1]:orb('Nostril',(side*.065,-.49,2.535),(.023,.014,.014),dark,20,12)
tube('Warm smile',[(-.15,-.375,2.43),(0,-.407,2.405),(.15,-.375,2.43)],.012,dark)
for side in [-1,1]:
    for i in range(7):tuft('Swept moustache',[(side*.025,-.43,2.49-i*.006),(side*.14,-.465,2.47-i*.015),(side*(.26+i*.009),-.35,2.48-i*.012)],.022,silver)
for i in range(19):
    x=(i-9)*.024;length=.29+.16*(1-abs(x)/.24)
    tuft('Silver beard lock',[(x,-.32,2.40),(x*1.15,-.42,2.23),(x*.55,-.34,2.40-length)],.035,silver)
# Dense tapered, gently bent hairs, batched into one mesh per body region.
# Real exported geometry gives the silhouette fuzz without a particle-system dependency.
hairmat=mat('Bumblebee fibres • amber and charcoal',(1,1,1),.92)
attr=hairmat.node_tree.nodes.new('ShaderNodeVertexColor');attr.layer_name='FibreColour'
hairmat.node_tree.links.new(attr.outputs['Color'],hairmat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
rng=np.random.default_rng(77)
def fuzzy(name,center,scale,count,length,region):
    center=Vector(center);scale=Vector(scale);vs=[];fs=[];cols=[]
    for _ in range(count):
        z=rng.uniform(-1,1);a=rng.uniform(0,math.tau);r=math.sqrt(1-z*z)
        unit=Vector((r*math.cos(a),r*math.sin(a),z));p=center+Vector((unit.x*scale.x,unit.y*scale.y,unit.z*scale.z))
        if region=='head' and p.y<-.16 and abs(p.x)<.34 and p.z<2.91:continue
        if region=='thorax' and p.y<.06 and p.z<2.15:continue
        if region=='abdomen' and p.y<.06 and p.z>1.38:continue
        if region=='cheek' and (p.y>-.28 or abs(p.x)<.20):continue
        n=Vector((unit.x/scale.x,unit.y/scale.y,unit.z/scale.z)).normalized()
        tangent=n.cross(Vector((0,0,1)))
        if tangent.length<.01:tangent=n.cross(Vector((1,0,0)))
        tangent.normalize();bitan=n.cross(tangent).normalized()
        ln=length*rng.uniform(.65,1.3);rad=rng.uniform(.0008,.0015)
        bend=(Vector((0,0,-1))-n*n.z)*ln*.27+tangent*rng.uniform(-.008,.008)
        v=1-math.acos(z)/math.pi
        isdark=region=='abdomen' and math.sin(v*math.pi*8)<0
        color=np.array([.038,.027,.016] if isdark else [.52,.30,.075])*rng.uniform(.78,1.15)
        base=len(vs)
        for j in range(4):
            t=j/3;q=p-n*.003+n*(ln*t)+bend*t*t;width=rad*(1-t*.97)
            for k in range(3):
                angle=k*math.tau/3;vs.append(q+width*(tangent*math.cos(angle)+bitan*math.sin(angle)))
                c=color*(.80+.35*t);cols.append((*np.clip(c,0,1),1))
                if j<3:fs.append((base+j*3+k,base+j*3+(k+1)%3,base+(j+1)*3+(k+1)%3,base+(j+1)*3+k))
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update()
    colors=me.color_attributes.new(name='FibreColour',type='FLOAT_COLOR',domain='POINT')
    for c,value in zip(colors.data,cols):c.color=value
    ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);finish(ob,name,hairmat)
fuzzy('Soft head fuzz',(0,-.02,2.64),(.47,.34,.48),14000,.042,'head')
fuzzy('Shoulder and thorax fuzz',(0,.045,1.94),(.47,.34,.48),9500,.046,'thorax')
fuzzy('Striped bumblebee abdomen fuzz',(0,.13,1.24),(.57,.43,.64),14000,.043,'abdomen')
for side in [-1,1]:fuzzy('Cheek fuzz',(side*.24,-.275,2.51),(.18,.11,.17),2300,.023,'cheek')

# Four thin wings with explicit branching veins; swept back behind the shoulders.
for side in [-1,1]:
    for small in [False,True]:
        base=Vector((side*.28,.24,1.88 if small else 2.13));tip=Vector((side*(1.03 if small else 1.24),.42,2.40 if small else 3.13));d=tip-base;across=Vector((d.z,0,-d.x)).normalized();vs=[];uv=[];fs=[];N=28;M=12
        def wp(v,u):return base+d*v+across*(u*(.18 if small else .25)*math.sin(math.pi*v)**.75)+Vector((0,.09*math.sin(v*math.pi)*(1-u*u),0))
        for j in range(N+1):
            v=.001+.998*j/N
            for i in range(M+1):
                u=i/M*2-1;vs.append(wp(v,u));uv.append((i/M,j/N))
                if i<M and j<N:k=j*(M+1)+i;fs.append((k,k+1,k+M+2,k+M+1))
        w=mesh('Hind wing' if small else 'Forewing',vs,fs,uv,wing)
        tube('Wing central vein',[wp(t,0) for t in np.linspace(.015,.98,12)],.009,vein)
        for edge in [-1,1]:
            tube('Wing edge',[wp(t,edge) for t in np.linspace(.005,.995,24)],.006,vein)
            for t in [.22,.39,.56,.72]:tube('Wing branching vein',[wp(t,0),wp(t+.07,edge*.5),wp(min(.97,t+.15),edge)],.004,vein)
# Twisted wood walking staff and honey-amber finial.
tube('Walking staff',[(.92,-.15,.05),(.90,-.16,.80),(.91,-.17,1.5),(.91,-.16,2.20),(.87,-.15,2.45)],.033,leather)
for z in np.linspace(1.82,2.10,9):tube('Staff grip wrapping',[(.91+.040*math.cos(a),-.16+.040*math.sin(a),z+.015*a/math.tau) for a in np.linspace(0,math.tau,16)],.006,thread)
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.115,location=(.87,-.15,2.48));finish(bpy.context.object,'Honey amber staff stone',bronze)
for side in [-1,1]:tube('Staff stone cradle',[(.91,-.15,2.31),(.87+side*.09,-.15,2.42),(.87+side*.06,-.15,2.55)],.014,leather)
for name,loc in [('anchor_voice',(0,-.44,2.44)),('anchor_journal',(0,-.55,1.48)),('anchor_staff',(.91,-.16,1.98))]:
    o=bpy.data.objects.new(name,None);o.location=loc;bpy.context.collection.objects.link(o)
bpy.context.scene.unit_settings.system='METRIC'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'elder-clover-source.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'elder-clover.glb'),export_format='GLB',export_apply=True,export_animations=False,export_yup=True)
print('ELDER_CLOVER_EXPORTED')
