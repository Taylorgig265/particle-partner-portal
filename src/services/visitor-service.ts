
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Get or create visitor ID from localStorage
const getOrCreateVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('visitor_id', visitorId);
  }
  
  return visitorId;
};

// Record a page visit
export const recordPageVisit = async (page: string) => {
  const visitorId = getOrCreateVisitorId();
  const userAgent = navigator.userAgent;
  
  try {
    console.log(`Recording visit to page: ${page} for visitor: ${visitorId}`);
    await supabase.from('visits').insert({
      visitor_id: visitorId,
      page,
      user_agent: userAgent
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error recording page visit:', error);
    return { success: false, error };
  }
};

// Get visitor statistics
export const getVisitorStats = async () => {
  try {
    console.log('Fetching visitor statistics from Supabase...');
    
    // Get total unique visitors
    const { data: visitorsData, error: visitorsError } = await supabase
      .from('visits')
      .select('visitor_id');
      
    if (visitorsError) {
      console.error('Error fetching visitor IDs:', visitorsError);
      throw visitorsError;
    }
    
    console.log(`Retrieved ${visitorsData?.length || 0} visit records`);
    
    // Count unique visitor IDs
    const uniqueVisitors = new Set(visitorsData?.map(v => v.visitor_id)).size;
    console.log(`Calculated ${uniqueVisitors} unique visitors`);
    
    // Get total page views
    const { count: totalPageViews, error: viewsError } = await supabase
      .from('visits')
      .select('*', { count: 'exact' });
      
    if (viewsError) {
      console.error('Error fetching page views count:', viewsError);
      throw viewsError;
    }
    
    console.log(`Retrieved ${totalPageViews} total page views`);
    
    // Get page views by page
    const { data: pageViewsData, error: pageError } = await supabase
      .from('visits')
      .select('page');
      
    if (pageError) {
      console.error('Error fetching page views by page:', pageError);
      throw pageError;
    }
    
    // Count occurrences of each page
    const pageViewsByPage = pageViewsData?.reduce((acc, { page }) => {
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to format expected by the component
    const pageViewsByPageArray = Object.entries(pageViewsByPage || {}).map(([page, count]) => ({
      page,
      count
    }));
    
    // Get recent visits
    const { data: recentVisits, error: recentError } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (recentError) {
      console.error('Error fetching recent visits:', recentError);
      throw recentError;
    }

    // Get visits per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: dailyVisits, error: dailyError } = await supabase
      .from('visits')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
      
    if (dailyError) {
      console.error('Error fetching daily visits:', dailyError);
      throw dailyError;
    }

    // Process daily visits into a format suitable for charts
    const visitsByDay: { [key: string]: number } = {};
    
    if (dailyVisits) {
      dailyVisits.forEach(visit => {
        const date = new Date(visit.created_at).toLocaleDateString();
        visitsByDay[date] = (visitsByDay[date] || 0) + 1;
      });
    }
    
    const dailyVisitsData = Object.entries(visitsByDay).map(([date, count]) => ({
      date,
      visits: count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('Visitor statistics results:', {
      uniqueVisitors,
      totalPageViews,
      pageViewsByPageArray: pageViewsByPageArray.length,
      recentVisits: recentVisits?.length || 0,
      dailyVisitsData: dailyVisitsData.length
    });
    
    return {
      uniqueVisitorCount: uniqueVisitors,
      totalPageViews,
      pageViewsByPage: pageViewsByPageArray,
      recentVisits: recentVisits || [],
      dailyVisitsData,
      success: true
    };
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return { 
      uniqueVisitorCount: 0,
      totalPageViews: 0,
      pageViewsByPage: [],
      recentVisits: [],
      dailyVisitsData: [],
      success: false, 
      error 
    };
  }
};
