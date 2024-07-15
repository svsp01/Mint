import dbConnect from '@/DBConnect/dbConnect';
import Jobs from '@/models/Jobs';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keywords = searchParams.get('keywords');

  if (!keywords) {
    return NextResponse.json(
      { success: false, error: 'Keywords are required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const latestJob = await Jobs.findOne({ keywords }).sort('-scrapedAt').exec();

    if (latestJob && latestJob.scrapedAt > sixHoursAgo) {
      const jobs = await Jobs.find({ keywords }).sort('-postedAt').exec();
      return NextResponse.json({ success: true, data: jobs, source: 'database' });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keywords)}+jobs&ibp=htl;jobs&tbs=qdr:d`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.iFjolb');

    const jobListings = await page.evaluate(() => {
      const listings = document.querySelectorAll('.iFjolb');
      return Array.from(listings).map(listing => {
        const title = listing.querySelector('.BjJfJf')?.textContent?.trim();
        const company = listing.querySelector('.vNEEBe')?.textContent?.trim();
        const location = listing.querySelector('.Qk80Jf')?.textContent?.trim();
        const url = listing.querySelector('a')?.href;
        const postedAt = listing.querySelector('.SuWscb')?.textContent?.trim();
        
        return { title, company, location, url, postedAt };
      }).filter(job => job.title && job.company);
    });

    await browser.close();

    const now = new Date();
    for (const jobData of jobListings) {
      await Jobs.findOneAndUpdate(
        { title: jobData.title, company: jobData.company, keywords },
        {
          ...jobData,
          keywords,
          postedAt: new Date(jobData.postedAt || now),
          scrapedAt: now
        },
        { upsert: true, new: true }
      );
    }

    const sortedJobs = await Jobs.find({ keywords }).sort('-postedAt').exec();

    return NextResponse.json({ success: true, data: sortedJobs, source: 'scraped' });
  } catch (error: any) {
    console.error('Error processing job listings:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing job listings' },
      { status: 500 }
    );
  }
}