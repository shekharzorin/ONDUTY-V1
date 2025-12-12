
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const requests = await prisma.clientRequest.findMany({
            include: {
                employee: true,
                client: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching client requests:', error);
        return NextResponse.json({ error: 'Failed to fetch client requests' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, clientId, clientName, location, reason } = body;

        const newRequest = await prisma.clientRequest.create({
            data: {
                employeeId,
                clientId,
                clientName,
                location,
                reason,
                status: 'PENDING',
            },
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating client request:', error);
        return NextResponse.json({ error: 'Failed to create client request' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status, rejectionReason } = body;

        const updatedRequest = await prisma.clientRequest.update({
            where: { id },
            data: {
                status,
                rejectionReason,
            },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Error updating client request:', error);
        return NextResponse.json({ error: 'Failed to update client request' }, { status: 500 });
    }
}
