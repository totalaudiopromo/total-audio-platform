import axios from 'axios';

// 🎯 Enhanced Social Media Detection with Deep Research Accuracy
// Built for music industry professionals who need verified contacts

export interface SocialProfile {
  platform: string;
  username: string;
  displayName: string;
  verified: boolean;
  confidence: number; // 0-100
  followers?: number;
  bio?: string;
  location?: string;
  musicIndustry?: boolean;
  verificationMethods: string[];
  lastVerified: string;
}

export interface EnhancedSocialDetectionResult {
  profiles: SocialProfile[];
  totalConfidence: number;
  verificationMethods: string[];
  researchDepth: 'basic' | 'deep' | 'expert';
  recommendations: string[];
}

export class EnhancedSocialDetection {
  private readonly VERIFICATION_WEIGHTS = {
    nameMatch: 10,
    bioMatch: 25,
    locationMatch: 20,
    musicIndustryKeywords: 30,
    followerCount: 15,
    verificationBadge: 40,
    crossPlatformConsistency: 35,
    recentActivity: 20
  };

  constructor() {}

  async detectSocialProfiles(
    email: string,
    name: string,
    company?: string,
    location?: string
  ): Promise<EnhancedSocialDetectionResult> {
    console.log(`🔍 Starting deep social research for ${name} (${email})`);
    
    const profiles: SocialProfile[] = [];
    const verificationMethods: string[] = [];
    
    try {
      // 1. LinkedIn Deep Research (Most Reliable for B2B)
      const linkedInProfile = await this.researchLinkedIn(email, name, company, location);
      if (linkedInProfile) {
        profiles.push(linkedInProfile);
        verificationMethods.push('LinkedIn verification');
      }

      // 2. Twitter/X Deep Research
      const twitterProfile = await this.researchTwitter(name, company, location);
      if (twitterProfile) {
        profiles.push(twitterProfile);
        verificationMethods.push('Twitter verification');
      }

      // 3. Instagram Deep Research
      const instagramProfile = await this.researchInstagram(name, company, location);
      if (instagramProfile) {
        profiles.push(instagramProfile);
        verificationMethods.push('Instagram verification');
      }

      // 4. Cross-Platform Verification
      const verifiedProfiles = await this.crossPlatformVerification(profiles, name, company);
      
      // 5. Music Industry Specific Research
      const musicIndustryProfiles = await this.musicIndustryVerification(verifiedProfiles, company);
      
      // 6. Calculate Overall Confidence
      const totalConfidence = this.calculateTotalConfidence(musicIndustryProfiles);
      
      // 7. Generate Research Recommendations
      const recommendations = this.generateResearchRecommendations(musicIndustryProfiles, totalConfidence);
      
      console.log(`✅ Deep social research completed for ${name}`);
      console.log(`📊 Found ${musicIndustryProfiles.length} verified profiles`);
      console.log(`🎯 Total confidence: ${totalConfidence}/100`);
      
      return {
        profiles: musicIndustryProfiles,
        totalConfidence,
        verificationMethods,
        researchDepth: totalConfidence > 80 ? 'expert' : totalConfidence > 60 ? 'deep' : 'basic',
        recommendations
      };
      
    } catch (error) {
      console.error('❌ Enhanced social detection error:', error);
      return {
        profiles: [],
        totalConfidence: 0,
        verificationMethods: ['Error occurred during research'],
        researchDepth: 'basic',
        recommendations: ['Social research failed - manual verification recommended']
      };
    }
  }

  private async researchLinkedIn(
    email: string,
    name: string,
    company?: string,
    location?: string
  ): Promise<SocialProfile | null> {
    try {
      // LinkedIn research using multiple verification methods
      const searchResults = await this.searchLinkedIn(name, company);
      
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Find the most likely match using multiple criteria
      const bestMatch = this.findBestLinkedInMatch(searchResults, name, company, location, email);
      
      if (!bestMatch) {
        return null;
      }

      // Deep verification of the profile
      const verificationScore = await this.verifyLinkedInProfile(bestMatch, name, company, email);
      
      if (verificationScore < 50) {
        return null; // Too low confidence
      }

      return {
        platform: 'LinkedIn',
        username: bestMatch.publicIdentifier || '',
        displayName: bestMatch.firstName + ' ' + bestMatch.lastName,
        verified: verificationScore > 80,
        confidence: verificationScore,
        followers: bestMatch.followerCount,
        bio: bestMatch.headline,
        location: bestMatch.location,
        musicIndustry: this.isMusicIndustryProfile(bestMatch.headline, bestMatch.summary),
        verificationMethods: this.getLinkedInVerificationMethods(bestMatch, verificationScore),
        lastVerified: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('LinkedIn research error:', error);
      return null;
    }
  }

  private async researchTwitter(
    name: string,
    company?: string,
    location?: string
  ): Promise<SocialProfile | null> {
    try {
      // Twitter research with deep verification
      const searchResults = await this.searchTwitter(name, company);
      
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Find the most likely match
      const bestMatch = this.findBestTwitterMatch(searchResults, name, company, location);
      
      if (!bestMatch) {
        return null;
      }

      // Verify this is the right person
      const verificationScore = await this.verifyTwitterProfile(bestMatch, name, company);
      
      if (verificationScore < 40) {
        return null; // Too low confidence
      }

      return {
        platform: 'Twitter',
        username: bestMatch.username,
        displayName: bestMatch.name,
        verified: bestMatch.verified || false,
        confidence: verificationScore,
        followers: bestMatch.public_metrics?.followers_count,
        bio: bestMatch.description,
        location: bestMatch.location,
        musicIndustry: this.isMusicIndustryProfile(bestMatch.description, ''),
        verificationMethods: this.getTwitterVerificationMethods(bestMatch, verificationScore),
        lastVerified: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Twitter research error:', error);
      return null;
    }
  }

  private async researchInstagram(
    name: string,
    company?: string,
    location?: string
  ): Promise<SocialProfile | null> {
    try {
      // Instagram research with verification
      const searchResults = await this.searchInstagram(name, company);
      
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Find the most likely match
      const bestMatch = this.findBestInstagramMatch(searchResults, name, company, location);
      
      if (!bestMatch) {
        return null;
      }

      // Verify this is the right person
      const verificationScore = await this.verifyInstagramProfile(bestMatch, name, company);
      
      if (verificationScore < 30) {
        return null; // Too low confidence
      }

      return {
        platform: 'Instagram',
        username: bestMatch.username,
        displayName: bestMatch.full_name,
        verified: bestMatch.is_verified || false,
        confidence: verificationScore,
        followers: bestMatch.follower_count,
        bio: bestMatch.biography,
        location: bestMatch.biography, // Instagram doesn't have location field
        musicIndustry: this.isMusicIndustryProfile(bestMatch.biography, ''),
        verificationMethods: this.getInstagramVerificationMethods(bestMatch, verificationScore),
        lastVerified: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Instagram research error:', error);
      return null;
    }
  }

  private async crossPlatformVerification(
    profiles: SocialProfile[],
    name: string,
    company?: string
  ): Promise<SocialProfile[]> {
    // Cross-platform verification to ensure consistency
    const verifiedProfiles: SocialProfile[] = [];
    
    for (const profile of profiles) {
      let crossPlatformScore = profile.confidence;
      
      // Check if this person appears on multiple platforms consistently
      const otherProfiles = profiles.filter(p => p.platform !== profile.platform);
      
      for (const otherProfile of otherProfiles) {
        if (this.profilesAreConsistent(profile, otherProfile, name, company)) {
          crossPlatformScore += 15; // Bonus for consistency
        }
      }
      
      // Update confidence with cross-platform verification
      profile.confidence = Math.min(100, crossPlatformScore);
      profile.verificationMethods.push('Cross-platform verification');
      
      if (profile.confidence >= 60) {
        verifiedProfiles.push(profile);
      }
    }
    
    return verifiedProfiles;
  }

  private async musicIndustryVerification(
    profiles: SocialProfile[],
    company?: string
  ): Promise<SocialProfile[]> {
    // Music industry specific verification
    return profiles.map(profile => {
      let musicIndustryScore = profile.confidence;
      
      // Check if company is music industry related
      if (company && this.isMusicIndustryCompany(company)) {
        musicIndustryScore += 20;
      }
      
      // Check if bio contains music industry keywords
      if (profile.bio && this.isMusicIndustryProfile(profile.bio, '')) {
        musicIndustryScore += 25;
      }
      
      // Check if location is music industry hub
      if (profile.location && this.isMusicIndustryLocation(profile.location)) {
        musicIndustryScore += 15;
      }
      
      profile.confidence = Math.min(100, musicIndustryScore);
      profile.musicIndustry = profile.confidence > 70;
      
      if (profile.musicIndustry) {
        profile.verificationMethods.push('Music industry verification');
      }
      
      return profile;
    });
  }

  private calculateTotalConfidence(profiles: SocialProfile[]): number {
    if (profiles.length === 0) return 0;
    
    const totalScore = profiles.reduce((sum, profile) => sum + profile.confidence, 0);
    const averageScore = totalScore / profiles.length;
    
    // Bonus for having multiple verified profiles
    const multiPlatformBonus = Math.min(20, profiles.length * 5);
    
    return Math.min(100, averageScore + multiPlatformBonus);
  }

  private generateResearchRecommendations(
    profiles: SocialProfile[],
    totalConfidence: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (totalConfidence < 50) {
      recommendations.push('Low confidence - manual verification required');
      recommendations.push('Check company website for official contact details');
      recommendations.push('Verify through mutual industry connections');
    } else if (totalConfidence < 80) {
      recommendations.push('Medium confidence - additional verification recommended');
      recommendations.push('Cross-reference with company directory');
      recommendations.push('Check recent social media activity');
    } else {
      recommendations.push('High confidence - profiles verified through multiple sources');
      recommendations.push('Ready for professional outreach');
    }
    
    if (profiles.length === 0) {
      recommendations.push('No social profiles found - use email only');
      recommendations.push('Consider phone verification for critical contacts');
    }
    
    return recommendations;
  }

  // Helper methods for deep verification
  private async verifyLinkedInProfile(profile: any, name: string, company?: string, email?: string): Promise<number> {
    let score = 0;
    
    // Name matching (exact match gets higher score)
    if (profile.firstName && profile.lastName) {
      const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const searchName = name.toLowerCase();
      
      if (fullName === searchName) score += 30;
      else if (fullName.includes(searchName) || searchName.includes(fullName)) score += 20;
      else if (this.namesAreSimilar(fullName, searchName)) score += 15;
    }
    
    // Company verification
    if (company && profile.company) {
      if (profile.company.toLowerCase().includes(company.toLowerCase())) score += 25;
    }
    
    // Email domain verification
    if (email && profile.email) {
      const emailDomain = email.split('@')[1];
      if (profile.email.includes(emailDomain)) score += 20;
    }
    
    // Profile completeness
    if (profile.headline) score += 10;
    if (profile.summary) score += 10;
    if (profile.location) score += 5;
    
    return Math.min(100, score);
  }

  private async verifyTwitterProfile(profile: any, name: string, company?: string): Promise<number> {
    let score = 0;
    
    // Name matching
    if (profile.name) {
      const profileName = profile.name.toLowerCase();
      const searchName = name.toLowerCase();
      
      if (profileName === searchName) score += 25;
      else if (profileName.includes(searchName) || searchName.includes(profileName)) score += 20;
      else if (this.namesAreSimilar(profileName, searchName)) score += 15;
    }
    
    // Bio verification
    if (profile.description) {
      if (company && profile.description.toLowerCase().includes(company.toLowerCase())) score += 20;
      if (this.isMusicIndustryProfile(profile.description, '')) score += 15;
    }
    
    // Verification badge
    if (profile.verified) score += 20;
    
    // Activity level
    if (profile.public_metrics?.tweet_count > 100) score += 10;
    
    return Math.min(100, score);
  }

  private async verifyInstagramProfile(profile: any, name: string, company?: string): Promise<number> {
    let score = 0;
    
    // Name matching
    if (profile.full_name) {
      const profileName = profile.full_name.toLowerCase();
      const searchName = name.toLowerCase();
      
      if (profileName === searchName) score += 20;
      else if (profileName.includes(searchName) || searchName.includes(profileName)) score += 15;
      else if (this.namesAreSimilar(profileName, searchName)) score += 10;
    }
    
    // Bio verification
    if (profile.biography) {
      if (company && profile.biography.toLowerCase().includes(company.toLowerCase())) score += 20;
      if (this.isMusicIndustryProfile(profile.biography, '')) score += 15;
    }
    
    // Verification badge
    if (profile.is_verified) score += 20;
    
    // Follower count (reasonable range for professionals)
    if (profile.follower_count && profile.follower_count > 100 && profile.follower_count < 100000) score += 10;
    
    return Math.min(100, score);
  }

  // Utility methods
  private namesAreSimilar(name1: string, name2: string): boolean {
    const words1 = name1.split(' ').filter(w => w.length > 2);
    const words2 = name2.split(' ').filter(w => w.length > 2);
    
    const commonWords = words1.filter(w1 => 
      words2.some(w2 => this.levenshteinDistance(w1, w2) <= 2)
    );
    
    return commonWords.length >= Math.min(words1.length, words2.length) * 0.7;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private isMusicIndustryProfile(bio: string, summary: string): boolean {
    const musicKeywords = [
      'music', 'radio', 'playlist', 'curator', 'dj', 'producer', 'artist', 'label',
      'promotion', 'pr', 'marketing', 'blogger', 'journalist', 'critic', 'reviewer',
      'broadcast', 'streaming', 'spotify', 'apple music', 'youtube', 'soundcloud',
      'bandcamp', 'record', 'album', 'single', 'ep', 'mixtape', 'remix', 'cover'
    ];
    
    const text = (bio + ' ' + summary).toLowerCase();
    const matches = musicKeywords.filter(keyword => text.includes(keyword));
    
    return matches.length >= 2; // At least 2 music-related keywords
  }

  private isMusicIndustryCompany(company: string): boolean {
    const musicCompanies = [
      'bbc', 'radio', 'spotify', 'apple', 'youtube', 'soundcloud', 'bandcamp',
      'warner', 'sony', 'universal', 'emi', 'atlantic', 'def jam', 'interscope',
      'republic', 'columbia', 'capitol', 'island', 'polydor', 'mercury'
    ];
    
    const companyLower = company.toLowerCase();
    return musicCompanies.some(musicCompany => companyLower.includes(musicCompany));
  }

  private isMusicIndustryLocation(location: string): boolean {
    const musicHubs = [
      'london', 'manchester', 'birmingham', 'bristol', 'glasgow', 'edinburgh',
      'new york', 'los angeles', 'nashville', 'austin', 'atlanta', 'chicago',
      'toronto', 'montreal', 'vancouver', 'sydney', 'melbourne', 'berlin',
      'amsterdam', 'paris', 'madrid', 'milan', 'tokyo'
    ];
    
    const locationLower = location.toLowerCase();
    return musicHubs.some(hub => locationLower.includes(hub));
  }

  private profilesAreConsistent(
    profile1: SocialProfile,
    profile2: SocialProfile,
    name: string,
    company?: string
  ): boolean {
    // Check if profiles represent the same person
    const name1 = profile1.displayName.toLowerCase();
    const name2 = profile2.displayName.toLowerCase();
    
    // Names should be similar
    if (!this.namesAreSimilar(name1, name2)) return false;
    
    // Company should be consistent if available
    if (company && profile1.bio && profile2.bio) {
      const companyLower = company.toLowerCase();
      const hasCompany1 = profile1.bio.toLowerCase().includes(companyLower);
      const hasCompany2 = profile2.bio.toLowerCase().includes(companyLower);
      
      if (hasCompany1 !== hasCompany2) return false;
    }
    
    // Location should be consistent if available
    if (profile1.location && profile2.location) {
      const loc1 = profile1.location.toLowerCase();
      const loc2 = profile2.location.toLowerCase();
      
      if (loc1 !== loc2 && !loc1.includes(loc2) && !loc2.includes(loc1)) {
        return false;
      }
    }
    
    return true;
  }

  // Mock API methods (replace with real API calls)
  private async searchLinkedIn(name: string, company?: string): Promise<any[]> {
    // Mock LinkedIn search - replace with real API
    return [];
  }

  private async searchTwitter(name: string, company?: string): Promise<any[]> {
    // Mock Twitter search - replace with real API
    return [];
  }

  private async searchInstagram(name: string, company?: string): Promise<any[]> {
    // Mock Instagram search - replace with real API
    return [];
  }

  private findBestLinkedInMatch(results: any[], name: string, company?: string, location?: string, email?: string): any | null {
    // Find best LinkedIn match using multiple criteria
    return null;
  }

  private findBestTwitterMatch(results: any[], name: string, company?: string, location?: string): any | null {
    // Find best Twitter match using multiple criteria
    return null;
  }

  private findBestInstagramMatch(results: any[], name: string, company?: string, location?: string): any | null {
    // Find best Instagram match using multiple criteria
    return null;
  }

  private getLinkedInVerificationMethods(profile: any, score: number): string[] {
    const methods: string[] = [];
    if (score > 80) methods.push('High confidence match');
    if (profile.company) methods.push('Company verification');
    if (profile.location) methods.push('Location verification');
    return methods;
  }

  private getTwitterVerificationMethods(profile: any, score: number): string[] {
    const methods: string[] = [];
    if (score > 80) methods.push('High confidence match');
    if (profile.verified) methods.push('Twitter verified account');
    if (profile.description) methods.push('Bio verification');
    return methods;
  }

  private getInstagramVerificationMethods(profile: any, score: number): string[] {
    const methods: string[] = [];
    if (score > 80) methods.push('High confidence match');
    if (profile.is_verified) methods.push('Instagram verified account');
    if (profile.biography) methods.push('Bio verification');
    return methods;
  }
}

export default EnhancedSocialDetection;
