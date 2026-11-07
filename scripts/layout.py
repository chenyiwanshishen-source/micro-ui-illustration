"""Dependency-free geometry helpers. Input widths must be measured, not guessed."""
from math import radians, sin, cos

def row(*, x, y, width=None, height=None, text_width, line_heights, icon=0, action=0,
        padding=(8,8,8,8), gap=8, action_gap=8, line_gap=3):
    """Return shared local slots; padding order L,T,R,B. Raises on content overflow."""
    pl,pt,pr,pb=padding
    values=[x,y,text_width,icon,action,pl,pt,pr,pb,gap,action_gap,line_gap,*line_heights]
    if not line_heights or any(not isinstance(v,(int,float)) for v in values):
        raise ValueError('Numeric geometry and at least one line height required')
    if any(v<0 for v in [text_width,icon,action,pl,pt,pr,pb,gap,action_gap,line_gap,*line_heights]):
        raise ValueError('Sizes must be nonnegative')
    ig=gap if icon else 0; ag=action_gap if action else 0
    th=sum(line_heights)+line_gap*(len(line_heights)-1)
    minimum_width=pl+icon+ig+text_width+ag+action+pr
    minimum_height=pt+max(icon,action,th)+pb
    w=minimum_width if width is None else width
    h=minimum_height if height is None else height
    if w<minimum_width or h<minimum_height:
        raise ValueError(f'Content overflow: need {minimum_width}x{minimum_height}, got {w}x{h}')
    cy=y+pt+(h-pt-pb)/2
    tx=x+pl+icon+ig; tops=[]; top=cy-th/2
    for lh in line_heights:tops.append(top);top+=lh+line_gap
    return dict(box=[x,y,w,h],content_mid_y=cy,icon=[x+pl,cy-icon/2,icon,icon],
                text_x=tx,text_tops=tops,text_available=w-pl-pr-icon-ig-action-ag,
                action=[x+w-pr-action,cy-action/2,action,action],minimum=[minimum_width,minimum_height])

def rows(*, x, y, width, height, count, gap=0):
    if count<1 or int(count)!=count or min(width,height,gap)<0:raise ValueError('Invalid rows')
    return [[x,y+i*(height+gap),width,height] for i in range(count)]

def rotated_bounds(box,angle=0,pivot=None):
    x,y,w,h=box
    if min(w,h)<0:raise ValueError('Negative box size')
    px,py=pivot if pivot is not None else (x+w/2,y+h/2)
    c,s=cos(radians(angle)),sin(radians(angle));points=[]
    for a,b in [(x,y),(x+w,y),(x+w,y+h),(x,y+h)]:
        points.append((px+(a-px)*c-(b-py)*s,py+(a-px)*s+(b-py)*c))
    xs,ys=zip(*points);return [min(xs),min(ys),max(xs)-min(xs),max(ys)-min(ys)]

def inside(box,canvas,inset=0):
    x,y,w,h=box;cx,cy,cw,ch=canvas
    return x>=cx+inset and y>=cy+inset and x+w<=cx+cw-inset and y+h<=cy+ch-inset

if __name__=='__main__':
    import argparse,json
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('spec',help='JSON with operation and keyword arguments')
    a=p.parse_args();d=json.load(open(a.spec));op=d.pop('operation');fn={'row':row,'rows':rows,'rotated_bounds':rotated_bounds,'inside':inside}.get(op)
    if fn is None:raise SystemExit('Unknown operation')
    print(json.dumps(fn(**d),ensure_ascii=False,indent=2))
