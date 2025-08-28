import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    agencyId?: string | null;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        agencyId: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
    return;
  };
};

export const requireAgencyAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const { agencyId } = req.params;
  
  if (req.user.role === 'ADMIN') {
    next();
    return;
  }

  if (req.user.role === 'AGENCY' && req.user.agencyId === agencyId) {
    next();
    return;
  }

  if (!agencyId) {
    res.status(400).json({ error: 'Agency ID required' });
    return;
  }

  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
  });

  if (!agency) {
    res.status(404).json({ error: 'Agency not found' });
    return;
  }

  if (agency.ownerId === req.user.id) {
    next();
    return;
  }

  res.status(403).json({ error: 'Access denied' });
};