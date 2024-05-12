import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';
import { blogInput, updateBlogInput } from '@abhinavchandra7020/blog-app-project-common1';

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}, 
  Variables: {
    userId: string
  }
}>();

blogRouter.use('/*', async (c,next) =>{
    try{
      const jwt = c.req.header('Authorization');
    if(!jwt){
      c.status(401)
      return c.json({
        error: "Unauthorized"
      });
    }
  
    const token = jwt.split(' ')[1];
    const payload = await verify(token, c.env.JWT_SECRET)
  
    if(!payload){
      c.status(401)
      return c.json({
        error: "Unauthorized"
      });
    }
  
    c.set('userId', payload.id);
    await next();
    } catch(e){
      c.status(403)
      return c.json({
        error: "invalid request"
    })
  }
})
  
  
  blogRouter.post('/', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate()) 

    const body = await c.req.json()

    const { success } = blogInput.safeParse(body)
    
    if(!success){
      c.status(411)
      return c.json({
        err: "Incorrect inputs"
      })
    }

    try {
      const blog = await prisma.post.create({
        data:{
          title: body.title,
          content: body.content,
          authorId: c.get('userId')
        }
      })

      return c.json({
        id: blog.id
      })
    } catch(e){
      c.status(403)
      return c.json({
        error: "invalid request"
      })
    }
  })
  
  blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())  

    const body = await c.req.json()

    const { success } = updateBlogInput.safeParse(body)
    
    if(!success){
      c.status(411)
      return c.json({
        err: "Incorrect inputs"
      })
    }

    const blog = await prisma.post.update({
      where:{
        id: body.id
      }, 
      data: {
        title: body.title,
        content: body.content
      }
    })

    return c.json({
      id: blog.id
    })
  })

  blogRouter.get('/bulk', async(c) =>{

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blogs = await prisma.post.findMany({
      skip: 1,
      take: 2
    })
  
    return c.json(blogs);
  });  

  blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id')

    try{
      const blog = await prisma.post.findFirst({
        where:{
          id: parseInt(id)
        }
      })
  
      return c.json({
        blog
      })
    } catch (e){
      c.status(411)
      c.json({
        message: "Blog does not exist"
      })
    }
  })
