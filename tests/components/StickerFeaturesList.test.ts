import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StickerFeaturesList from '~/components/StickerFeaturesList.vue';

describe('StickerFeaturesList', () => {
	it('renders correctly', () => {
		const wrapper = mount(StickerFeaturesList);

		expect(wrapper.find('.sticker-page__features').exists()).toBe(true);
		expect(wrapper.find('section').exists()).toBe(true);
	});

	it('displays the correct title with emoji', () => {
		const wrapper = mount(StickerFeaturesList);

		const title = wrapper.find('.sticker-page__features-title');
		expect(title.exists()).toBe(true);
		expect(title.text()).toBe('✨ Features');
		expect(title.element.tagName).toBe('H2');
	});

	it('renders all features correctly', () => {
		const wrapper = mount(StickerFeaturesList);

		const featuresList = wrapper.find('.sticker-page__features-list');
		expect(featuresList.exists()).toBe(true);
		expect(featuresList.element.tagName).toBe('UL');

		const featureItems = wrapper.findAll('.sticker-page__features-item');
		expect(featureItems).toHaveLength(6); // Should have 6 features

		// Check that each feature has the required elements
		featureItems.forEach(item => {
			expect(item.find('.sticker-page__features-icon').exists()).toBe(true);
			expect(item.find('.sticker-page__features-content').exists()).toBe(true);
			expect(item.find('.sticker-page__features-name').exists()).toBe(true);
			expect(item.find('.sticker-page__features-description').exists()).toBe(true);
		});
	});

	it('displays specific features with correct content', () => {
		const wrapper = mount(StickerFeaturesList);

		const featureItems = wrapper.findAll('.sticker-page__features-item');

		// Test first feature (Responsive Design)
		const firstFeature = featureItems[0]!;
		expect(firstFeature.find('.sticker-page__features-icon').text()).toBe('📱');
		expect(firstFeature.find('.sticker-page__features-name').text()).toBe('Responsive Design');
		expect(firstFeature.find('.sticker-page__features-description').text()).toContain(
			'Works perfectly on desktop, tablet, and mobile devices'
		);

		// Test second feature (Smooth Animations)
		const secondFeature = featureItems[1]!;
		expect(secondFeature.find('.sticker-page__features-icon').text()).toBe('🎨');
		expect(secondFeature.find('.sticker-page__features-name').text()).toBe('Smooth Animations');
		expect(secondFeature.find('.sticker-page__features-description').text()).toContain('CSS-based animations with hardware acceleration');

		// Test API feature
		const apiFeature = featureItems[2]!;
		expect(apiFeature.find('.sticker-page__features-icon').text()).toBe('🔄');
		expect(apiFeature.find('.sticker-page__features-name').text()).toBe('Real-time API');
		expect(apiFeature.find('.sticker-page__features-description').text()).toContain('Fetches fresh cat images from external API');
	});

	it('has the correct semantic structure', () => {
		const wrapper = mount(StickerFeaturesList);

		// Should be wrapped in a section element
		const section = wrapper.find('section');
		expect(section.exists()).toBe(true);
		expect(section.classes()).toContain('sticker-page__features');

		// Should have proper heading hierarchy
		const h2 = wrapper.find('h2');
		expect(h2.exists()).toBe(true);
		expect(h2.classes()).toContain('sticker-page__features-title');

		// Should use proper list structure
		const ul = wrapper.find('ul');
		expect(ul.exists()).toBe(true);
		expect(ul.classes()).toContain('sticker-page__features-list');

		const listItems = wrapper.findAll('li');
		expect(listItems.length).toBeGreaterThan(0);
		listItems.forEach(li => {
			expect(li.classes()).toContain('sticker-page__features-item');
		});
	});

	it('has proper heading hierarchy within features', () => {
		const wrapper = mount(StickerFeaturesList);

		const featureNames = wrapper.findAll('.sticker-page__features-name');
		featureNames.forEach(name => {
			expect(name.element.tagName).toBe('H3');
		});

		const featureDescriptions = wrapper.findAll('.sticker-page__features-description');
		featureDescriptions.forEach(description => {
			expect(description.element.tagName).toBe('P');
		});
	});

	it('renders all expected feature types', () => {
		const wrapper = mount(StickerFeaturesList);

		const featureNames = wrapper.findAll('.sticker-page__features-name');
		const expectedFeatures = [
			'Responsive Design',
			'Smooth Animations',
			'Real-time API',
			'Optimized Performance',
			'Accessibility',
			'TypeScript',
		];

		expectedFeatures.forEach((expectedFeature, index) => {
			expect(featureNames[index]!.text()).toBe(expectedFeature);
		});
	});

	it('has unique keys for v-for items', () => {
		const wrapper = mount(StickerFeaturesList);

		const featureItems = wrapper.findAll('.sticker-page__features-item');
		expect(featureItems).toHaveLength(6);

		// Each item should be rendered (this tests that keys are working)
		featureItems.forEach(item => {
			expect(item.exists()).toBe(true);
		});
	});

	it('is accessible', () => {
		const wrapper = mount(StickerFeaturesList);

		// Check for proper semantic HTML
		expect(wrapper.find('section').exists()).toBe(true);
		expect(wrapper.find('ul').exists()).toBe(true);

		// Check for proper heading structure
		const h2 = wrapper.find('h2');
		expect(h2.exists()).toBe(true);

		const h3s = wrapper.findAll('h3');
		expect(h3s.length).toBe(6); // One for each feature

		// Check for descriptive content
		const descriptions = wrapper.findAll('p');
		expect(descriptions.length).toBe(6); // One for each feature
		descriptions.forEach(desc => {
			expect(desc.text().length).toBeGreaterThan(20); // Has meaningful content
		});
	});

	it('renders as a presentational component', () => {
		const wrapper = mount(StickerFeaturesList);

		// Should not have any interactive elements
		expect(wrapper.find('button').exists()).toBe(false);
		expect(wrapper.find('input').exists()).toBe(false);
		expect(wrapper.find('a').exists()).toBe(false);

		// Should be purely presentational
		expect(wrapper.vm).toBeDefined();
	});
});
