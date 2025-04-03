
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
    // Get total unique visitors
    const { data: uniqueVisitors, error: uniqueError } = await supabase
      .from('visits')
      .select('visitor_id')
      .options({ count: 'exact' })
      .limit(1);
      
    if (uniqueError) throw uniqueError;
    
    // Get total page views
    const { count: totalPageViews, error: viewsError } = await supabase
      .from('visits')
      .select('*', { count: 'exact' });
      
    if (viewsError) throw viewsError;
    
    // Get page views by page
    const { data: pageViewsByPage, error: pageError } = await supabase
      .from('visits')
      .select('page, count')
      .options({ count: 'estimated' })
      .group('page');
      
    if (pageError) throw pageError;
    
    // Get recent visits
    const { data: recentVisits, error: recentError } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (recentError) throw recentError;

    // Get visits per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: dailyVisits, error: dailyError } = await supabase
      .from('visits')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
      
    if (dailyError) throw dailyError;

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
    
    return {
      uniqueVisitorCount: new Set(uniqueVisitors?.map(v => v.visitor_id)).size,
      totalPageViews,
      pageViewsByPage: pageViewsByPage || [],
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
