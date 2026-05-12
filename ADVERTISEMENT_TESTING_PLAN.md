# Advertisement System - Complete Testing Plan

## Testing Environment Setup

### Prerequisites
- ✅ Back Office (BO) running locally
- ✅ Mobile App (MA) running locally  
- ✅ Backend server running with new mobile endpoints
- ✅ Database with `user_dismissed_ads` table created

### Test Data Preparation
- Create 2-3 test user accounts in Firebase (get their UUIDs)
- Prepare 3-4 test banner images (different sizes/formats)

---

## Phase 1: Back Office Advertisement Management Testing

### Test Case 1.1: Create Advertisements
**Objective**: Verify ad creation works properly

**Steps**:
1. Login to Back Office admin panel
2. Navigate to Management > Ads
3. Click "New Ad" button
4. Create **3 test ads** with these details:

**Ad 1 - "Coffee Promotion"**
- Name: `Coffee Shop 50% Off`
- Description: `Limited time coffee promotion`
- Upload banner image (PNG/JPG, recommended 800x400px)
- Destination Link: `https://www.google.com/search?q=coffee`
- Publish Type: `IMMEDIATE`
- Status: Keep as `DRAFT` initially

**Ad 2 - "Restaurant Deal"**  
- Name: `Pizza Restaurant Grand Opening`
- Description: `New restaurant opening special`
- Upload different banner image
- Destination Link: `https://www.google.com/search?q=pizza`
- Publish Type: `IMMEDIATE`
- Status: Keep as `DRAFT` initially

**Ad 3 - "Shopping Sale"**
- Name: `Electronics Mega Sale`
- Description: `Electronics store clearance`
- Upload third banner image  
- Destination Link: `https://www.google.com/search?q=electronics`
- Publish Type: `IMMEDIATE`
- Status: Keep as `DRAFT` initially

**Expected Results**:
- ✅ All ads created successfully
- ✅ Banner images uploaded and displayed
- ✅ All ads show `DRAFT` status
- ✅ Ads appear in the list with correct information

---

### Test Case 1.2: Publish Advertisements  
**Objective**: Test publishing workflow

**Steps**:
1. In the ads list, publish ads **in this specific order**:
   - First publish: "Coffee Promotion" 
   - Wait 30 seconds
   - Then publish: "Restaurant Deal"
   - Wait 30 seconds  
   - Then publish: "Shopping Sale"

**Expected Results**:
- ✅ Status changes from `DRAFT` → `PUBLISHED`
- ✅ `publishedAt` timestamp recorded
- ✅ Summary shows "Active Ads" count = 3
- ✅ Summary shows "Published" count = 3

---

## Phase 2: Mobile App Integration Testing

### Test Case 2.1: First Ad Display
**Objective**: Verify first ad appears on home screen

**Mobile App Setup**:
- Use Test User 1 UUID: `test-user-1-uuid`
- Ensure user is logged in to mobile app

**Steps**:
1. Navigate to Home Screen in mobile app
2. Observe popup behavior

**Expected Results**:
- ✅ Ad popup appears immediately
- ✅ Shows "Coffee Promotion" banner (oldest published ad)
- ✅ Banner image loads correctly
- ✅ Close (X) button visible in top-right
- ✅ Banner is clickable

---

### Test Case 2.2: Ad Click Tracking
**Objective**: Test click functionality and analytics

**Steps**:
1. With "Coffee Promotion" ad displayed, tap on the banner image
2. Check mobile app behavior
3. Check Back Office analytics

**Expected Results**:
- ✅ Mobile app opens destination link (`https://www.google.com/search?q=coffee`)
- ✅ Ad popup closes after click
- ✅ In Back Office: Navigate to ads list and check "Coffee Promotion"
- ✅ Click counter should show `1 click`
- ✅ Analytics should update (may take a moment)

---

### Test Case 2.3: Ad Dismissal
**Objective**: Test dismiss functionality

**Steps**:
1. Navigate to Home Screen again
2. "Restaurant Deal" ad should appear (next in queue)
3. Click the X (close) button
4. Navigate away from Home Screen and back

**Expected Results**:
- ✅ Ad popup closes when X is clicked
- ✅ When returning to Home Screen, "Restaurant Deal" should NOT appear again
- ✅ "Shopping Sale" ad should appear instead (next in queue)

---

### Test Case 2.4: Multiple User Testing
**Objective**: Verify user-specific dismissal tracking

**Mobile App Setup**:
- Switch to Test User 2 UUID: `test-user-2-uuid`

**Steps**:
1. Navigate to Home Screen with User 2
2. Observe which ad appears

**Expected Results**:
- ✅ "Coffee Promotion" should appear (oldest ad, not dismissed by User 2)
- ✅ User 2 sees ads that User 1 dismissed
- ✅ Confirms user-specific dismissal tracking works

---

## Phase 3: Complete Flow Testing

### Test Case 3.1: Full Queue Exhaustion
**Objective**: Test behavior when all ads are dismissed

**Steps with User 1**:
1. Navigate to Home Screen → Should see "Shopping Sale"
2. Click X to dismiss it
3. Navigate to Home Screen again

**Expected Results**:
- ✅ No ad popup should appear
- ✅ Mobile app should handle "no ads" gracefully
- ✅ No errors in mobile app console

---

### Test Case 3.2: New Ad Addition
**Objective**: Test dynamic ad addition

**Steps**:
1. In Back Office, create and publish a new ad "New Product Launch"
2. In Mobile App (User 1), navigate to Home Screen

**Expected Results**:
- ✅ New ad should appear in popup
- ✅ Proves the queue updates dynamically

---

## Phase 4: Edge Cases & Error Handling

### Test Case 4.1: Network Issues
**Steps**:
1. Disconnect mobile app from internet
2. Navigate to Home Screen
3. Reconnect internet
4. Navigate to Home Screen again

**Expected Results**:
- ✅ App handles network errors gracefully
- ✅ No crashes or infinite loading
- ✅ Ads work normally after reconnection

---

### Test Case 4.2: Invalid Banner URLs
**Steps**:
1. In database, manually change a banner URL to invalid link
2. Test mobile app behavior

**Expected Results**:
- ✅ Mobile app shows placeholder or handles broken images gracefully
- ✅ No crashes

---

### Test Case 4.3: Invalid Destination Links
**Steps**:
1. Create ad with malformed destination URL
2. Test click behavior

**Expected Results**:
- ✅ Mobile app handles invalid URLs gracefully
- ✅ Shows error message or falls back appropriately

---

## Phase 5: Analytics Verification

### Test Case 5.1: Back Office Analytics
**Objective**: Verify all analytics are tracked correctly

**Steps**:
1. In Back Office, check each ad's analytics:
   - Total clicks
   - Unique users (if implemented)
   - Last click timestamp

**Expected Results**:
- ✅ Click counts match actual user interactions
- ✅ Timestamps are accurate
- ✅ Summary dashboard shows correct totals

---

## Phase 6: Performance Testing

### Test Case 6.1: Multiple Rapid Navigation
**Steps**:
1. Rapidly navigate to/from Home Screen 10 times
2. Check for memory leaks or performance issues

**Expected Results**:
- ✅ App remains responsive
- ✅ No memory leaks
- ✅ Ads load consistently

---

## Testing Checklist Summary

### Back Office Functionality:
- [ ] Ad creation works
- [ ] Image upload works  
- [ ] Publishing changes status
- [ ] Analytics display correctly
- [ ] Summary dashboard updates

### Mobile App Functionality:
- [ ] Ads popup on Home Screen navigation
- [ ] Click tracking works
- [ ] Dismiss functionality works
- [ ] User-specific dismissal tracking
- [ ] External links open correctly
- [ ] Graceful error handling

### Integration:
- [ ] Priority system works (oldest first)
- [ ] Real-time updates between BO and MA
- [ ] Multiple user isolation
- [ ] Queue exhaustion handling

### Database:
- [ ] `user_dismissed_ads` table populated correctly
- [ ] Click counters increment
- [ ] No duplicate dismissal records

---

## Troubleshooting Common Issues

### Issue: No ads appear on mobile
**Check**:
- Are there PUBLISHED ads in Back Office?
- Is mobile app using correct API endpoints?
- Check network connectivity
- Verify user ID is being sent correctly

### Issue: Same ad appears repeatedly  
**Check**:
- Is dismiss API working?
- Check `user_dismissed_ads` table for records
- Verify user ID consistency

### Issue: Click tracking not working
**Check**:
- Is click API being called?
- Check network requests in mobile app debugger
- Verify analytics update in Back Office

### Issue: Wrong ad priority
**Check**:
- Verify ads are ordered by `createdAt ASC`
- Check published timestamps
- Confirm filtering logic for dismissed ads

---

## Success Criteria

**The advertisement system is working correctly when**:
1. ✅ Ads created in BO appear in MA in correct order
2. ✅ User dismissals are permanent and user-specific  
3. ✅ Clicks are tracked accurately in BO analytics
4. ✅ External links open correctly from MA
5. ✅ System handles edge cases gracefully
6. ✅ Performance is acceptable under normal usage

**Ready for production when all test cases pass!** 🚀
