import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import HeroSlide from '@/models/HeroSlide';

export const dynamic = 'force-dynamic';

const defaultSlides = [
  { imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80", caption: "Creating Unforgettable Celebrations with Elegant Decorations", order: 1 },
  { imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1920&q=80", caption: "Grand Waterproof Canopy & Heavy Truss Tent Installations", order: 2 },
  { imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80", caption: "Concert Quality DJ & Synchronized Intelligent Lighting", order: 3 },
  { imageUrl: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1920&q=80", caption: "Luxury Catering Displays & Dynamic Multi-Cuisine Presentation", order: 4 },
  { imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1920&q=80", caption: "Custom Balloons Styling & Birthday Backdrops for Kids & Adults", order: 5 },
  { imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=80", caption: "Sharma Events - Your Partner in Creating Beautiful Memories", order: 6 },
];

export async function GET() {
  try {
    await dbConnect();
    
    // Auto-seed if slideshow is empty
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
      await HeroSlide.insertMany(defaultSlides);
    }

    const slides = await HeroSlide.find().sort({ order: 1 });

    const mappedSlides = slides.map(s => ({
      id: s._id.toString(),
      imageUrl: s.imageUrl,
      caption: s.caption || '',
      order: s.order || 0
    }));

    return NextResponse.json(mappedSlides);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero slides: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { imageUrl, caption, order } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing required field (imageUrl)' }, { status: 400 });
    }

    const newSlide = await HeroSlide.create({
      imageUrl,
      caption: caption || '',
      order: order !== undefined ? Number(order) : 0
    });

    return NextResponse.json({
      id: newSlide._id.toString(),
      imageUrl: newSlide.imageUrl,
      caption: newSlide.caption,
      order: newSlide.order
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
